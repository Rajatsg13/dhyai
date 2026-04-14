DHYAI — Iteration 2 (Hostinger Build)

This package is the Hostinger-compatible version of the DHYAI Iteration-2 website.
It is the same static HTML/CSS/JS site as the Netlify build, but the contact form
submits to a PHP handler (SMTP email) so enquiries can be emailed when hosted on Hostinger.

Pages
-----
- index.html
- about.html
- process.html
- studies.html
- sthna.html
- sthiti.html
- punar.html
- contact.html
- thank-you/index.html
- overview.html (quick links for review)

Images
------
All content images are stored in:
  assets/images/

This build uses JPEG (.jpg) for content imagery.

Contact form (Hostinger)
------------------------
The contact form posts to:
  contact.php

Email is sent via SMTP using PHPMailer (included in /lib/PHPMailer).

IMPORTANT:
1) Create the mailbox `contact@dhyai.studio` in Hostinger Email.
2) Open `config.php` and set:
   - SMTP_USERNAME (usually contact@dhyai.studio)
   - SMTP_PASSWORD (mailbox password)
   - SMTP_PORT / SMTP_SECURE if needed:
       * 587 + tls (recommended)
       * 465 + ssl (alternative)

3) Upload the site files to Hostinger (see below) and test the form.

Upload to Hostinger
-------------------
1) In Hostinger hPanel → Hosting → File Manager (or FTP)
2) Upload the CONTENTS of this folder into:
     public_html/
   so that public_html/index.html exists.

3) Visit:
   https://yourdomain.com/contact.html
   Submit the form and confirm email arrives at `contact@dhyai.studio`.

Troubleshooting
---------------
- If the form redirects back to contact.html?error=send:
  * Verify SMTP password in config.php
  * Try port 465 + ssl
  * Confirm the mailbox exists and the password is correct
