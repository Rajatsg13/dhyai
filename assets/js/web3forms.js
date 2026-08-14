/* DHYAI — Web3Forms integration.
 *
 * The enquiry form used to post to contact.php (PHP + PHPMailer over SMTP).
 * That only works on a PHP host like Hostinger — it silently fails on
 * Vercel, which has no PHP runtime. This replaces it with a client-side
 * fetch to Web3Forms, so the same static HTML works identically on both
 * Hostinger and Vercel with no server-side dependency at all.
 *
 * NOTE: this currently reuses the TechSolve44 Web3Forms access key, so
 * DHYAI enquiries land in the same inbox as TechSolve44's contact form,
 * distinguished by the `subject`/`from_name` fields sent below. If you'd
 * rather keep DHYAI's enquiries fully separate (e.g. delivered straight to
 * contact@dhyai.studio), sign up for a free access key at
 * https://web3forms.com tied to that email and swap the constant below.
 *
 * Mirrors techsolve44.com's implementation: never show a "sent" state
 * without a genuine confirmation from Web3Forms — it can return HTTP 200
 * with `{ success: false }`, so the status code alone isn't proof.
 */
var DHYAI_WEB3FORMS_KEY = '66f215ff-88b8-4266-b38a-e6aac88a5caa';
var DHYAI_WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function dhyaiSubmitToWeb3Forms(fields) {
  var payload = Object.assign({ access_key: DHYAI_WEB3FORMS_KEY }, fields);
  return fetch(DHYAI_WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).then(function (res) {
    return res
      .json()
      .catch(function () { return {}; })
      .then(function (data) {
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Submission failed (HTTP ' + res.status + ')');
        }
        return data;
      });
  });
}

function dhyaiWeb3FormsFriendlyError(err) {
  // fetch() rejects with TypeError when the request never left the browser.
  return err instanceof TypeError
    ? 'Could not reach the server. Check your connection and try again.'
    : 'Something went wrong sending that. Please try again in a moment.';
}
