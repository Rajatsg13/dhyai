<?php
/**
 * DHYAI — Contact form configuration (Hostinger-compatible).
 *
 * This website is a static HTML site with a PHP email handler for Hostinger.
 *
 * Steps:
 * 1) Create the mailbox `contact@dhyai.studio` in Hostinger Email.
 * 2) Set SMTP_PASSWORD below to that mailbox password.
 * 3) Upload the entire `dhyai-website/` folder contents to `public_html/`.
 *
 * SMTP settings (Hostinger):
 * - Host: smtp.hostinger.com
 * - Port: 587 (TLS/STARTTLS) or 465 (SSL)
 *
 * If you have trouble with TLS, switch to port 465 and set SMTP_SECURE='ssl'.
 */
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls'); // 'tls' for 587, 'ssl' for 465

define('SMTP_USERNAME', 'contact@dhyai.studio');
define('SMTP_PASSWORD', 'CHANGE_ME'); // <-- set this before going live

define('MAIL_FROM', 'contact@dhyai.studio');
define('MAIL_FROM_NAME', 'DHYAI');

define('MAIL_TO', 'contact@dhyai.studio');
define('MAIL_TO_NAME', 'DHYAI');
