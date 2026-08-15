<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$config = require __DIR__ . '/config.php';

// Validate required field
if (empty($_POST['form_contact'])) {
    echo "FAILURE";
    exit;
}

// Sanitize input
$contact = htmlspecialchars($_POST['form_contact'], ENT_QUOTES);

// Determine if contact is email or phone
$isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL);
$contactType = $isEmail ? "Email" : "Phone";

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
    
    // Only add reply-to if it's a valid email
    if ($isEmail) {
        $mail->addReplyTo($contact);
    }

    // Email content
    $mail->Subject = "Quick Connect Form";
    $mail->Body =
        "【クイックコネクト問い合わせ】\n\n" .
        "$contactType: $contact";

    $mail->send();
    echo "SUCCESS";

} catch (Exception $e) {
    echo "FAILURE";
}