<?php
    // Check for empty fields
    if(empty($_POST['form_name'])      ||
    empty($_POST['form_email'])     ||
    empty($_POST['form_message'])   ||
    !filter_var($_POST['form_email'],FILTER_VALIDATE_EMAIL))
    {
    echo "FAILURE";
    return false;
    }

    $name = strip_tags(htmlspecialchars($_POST['form_name']));
    $email_address = strip_tags(htmlspecialchars($_POST['form_email']));
    $phone = strip_tags(htmlspecialchars($_POST['form_phone']));
    $message = strip_tags(htmlspecialchars($_POST['form_message']));

    // Create the email and send the message
    $to = 'info@fields.jp';
    $email_subject = "Website Contact Form:  $name";
    $email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
    $headers = "From: noreply@fields.jp\n";
    $headers .= "Reply-To: $email_address";   
    mail($to,$email_subject,$email_body,$headers);
    echo "SUCCESS";
    return true;    
?>