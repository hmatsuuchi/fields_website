<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$config = require __DIR__ . '/config.php';

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
