<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$config = require __DIR__ . '/config.php';

// --- Cloudflare Turnstile (contact form spam protection) -------------------
// Needs 'turnstile_enabled' => true and 'turnstile_secret' => '...' in
// config.php. While the flag is missing or false this block does nothing, so
// the code can be deployed before the keys are in place.
function turnstile_log(string $msg): void {
    error_log('[turnstile] ' . $msg
        . ' ip=' . ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '?')
        . ' ua=' . substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 120));
}

function turnstile_token_ok(array $config): bool {
    if (empty($config['turnstile_enabled'])) {
        return true;
    }

    $token = trim((string)($_POST['cf-turnstile-response'] ?? ''));
    if ($token === '' || strlen($token) > 2048) {
        turnstile_log('missing or oversized token');
        return false;
    }

    $payload = http_build_query([
        'secret'   => (string)$config['turnstile_secret'],
        'response' => $token,
        'remoteip' => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 8,
    ]);
    $raw = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        turnstile_log('siteverify unreachable: ' . $err); // fail closed
        return false;
    }

    $res = json_decode((string)$raw, true);
    if (!is_array($res)) {
        turnstile_log('siteverify returned invalid json');
        return false;
    }

    if (empty($res['success'])) {
        turnstile_log('verify failed: ' . implode(',', (array)($res['error-codes'] ?? []))
            . ' host=' . ($res['hostname'] ?? '?'));
        return false;
    }

    // Cloudflare already validates the hostname against the widget's registered
    // hostnames; this is a second check. The allowlist is configurable because
    // Cloudflare's always-pass TEST secret reports hostname "example.com".
    $allowedHosts = (array)($config['turnstile_hosts'] ?? ['fields.jp', 'www.fields.jp']);
    if (!empty($res['hostname']) && !in_array($res['hostname'], $allowedHosts, true)) {
        turnstile_log('hostname mismatch: ' . $res['hostname']);
        return false;
    }

    return true;
}

// runs before the field validation: no token, no processing
if (!turnstile_token_ok($config)) {
    echo "FAILURE";
    exit;
}
// --- end Cloudflare Turnstile ---------------------------------------------

if (
    empty($_POST['form_name']) ||
    empty($_POST['form_email']) ||
    empty($_POST['form_message']) ||
    !filter_var($_POST['form_email'], FILTER_VALIDATE_EMAIL)
) {
    echo "FAILURE";
    exit;
}

$name = htmlspecialchars($_POST['form_name'], ENT_QUOTES);
$email = htmlspecialchars($_POST['form_email'], ENT_QUOTES);
$phone = htmlspecialchars($_POST['form_phone'] ?? '', ENT_QUOTES);
$message = htmlspecialchars($_POST['form_message'], ENT_QUOTES);

$mail = new PHPMailer(true);

// IMPORTANT: UTF-8 for Japanese
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

try {
    // Tell PHPMailer to use SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = $config['smtp_port'];

    // Email headers
    $mail->setFrom('noreply@fields.jp', 'Fields English');
    $mail->addAddress('info@fields.jp');
    $mail->addReplyTo($email, $name);

    // Email content
    $mail->Subject = "Website Contact Form: $name";
    $mail->Body =
        "Name: $name\n" .
        "Email: $email\n" .
        "Phone: $phone\n\n" .
        "Message:\n$message";

    $mail->send();
    echo "SUCCESS";

} catch (Exception $e) {
    echo "FAILURE";
}
