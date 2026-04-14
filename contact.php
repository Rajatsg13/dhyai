<?php
declare(strict_types=1);

/**
 * DHYAI — Contact form handler (Hostinger-compatible).
 * Uses SMTP via PHPMailer (no Composer required).
 */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  header('Location: contact.html');
  exit;
}

require __DIR__ . '/config.php';

// PHPMailer (manual include)
require __DIR__ . '/lib/PHPMailer/src/Exception.php';
require __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function clean_line(string $s): string {
  // prevent header injection
  $s = trim($s);
  $s = str_replace(["\r", "\n"], ' ', $s);
  return $s;
}

$name = clean_line((string)($_POST['name'] ?? ''));
$email = clean_line((string)($_POST['email'] ?? ''));
$phone = clean_line((string)($_POST['phone'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

// Honeypot fields (should remain empty)
$bot_field = trim((string)($_POST['bot-field'] ?? ''));
$company = trim((string)($_POST['company'] ?? ''));
if ($bot_field !== '' || $company !== '') {
  // Likely bot — pretend success
  header('Location: thank-you/');
  exit;
}

if ($name === '' || $email === '' || $message === '') {
  header('Location: contact.html?error=missing');
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  header('Location: contact.html?error=email');
  exit;
}

$subject = 'DHYAI enquiry — ' . $name;

$bodyLines = [];
$bodyLines[] = 'New enquiry from DHYAI website';
$bodyLines[] = '';
$bodyLines[] = 'Name: ' . $name;
$bodyLines[] = 'Email: ' . $email;
if ($phone !== '') $bodyLines[] = 'Phone: ' . $phone;
$bodyLines[] = '';
$bodyLines[] = 'Message:';
$bodyLines[] = $message;

$body = implode("\n", $bodyLines);

$mail = new PHPMailer(true);

try {
  $mail->CharSet = 'UTF-8';
  $mail->isSMTP();
  $mail->Host = SMTP_HOST;
  $mail->Port = (int)SMTP_PORT;
  $mail->SMTPSecure = SMTP_SECURE;
  $mail->SMTPAuth = true;
  $mail->Username = SMTP_USERNAME;
  $mail->Password = SMTP_PASSWORD;

  $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
  $mail->addAddress(MAIL_TO, MAIL_TO_NAME);
  $mail->addReplyTo($email, $name);

  $mail->Subject = $subject;
  $mail->Body = $body;
  $mail->AltBody = $body;

  $mail->send();

  header('Location: thank-you/');
  exit;
} catch (Exception $e) {
  // Avoid leaking server details to visitors
  header('Location: contact.html?error=send');
  exit;
}
