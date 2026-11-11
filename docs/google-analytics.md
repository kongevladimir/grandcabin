# Google Analytics and the booking funnel

The Google tag uses GA4 web stream `G-9LBLJXN92D`. It loads only on the public
pages listed in `src/lib/analytics/model.ts`, on the production domain, after
analytics consent. Marketing consent controls Google's ad consent fields;
marketing consent alone does not start the Analytics tag. Consent is stored in
the browser and can be changed using the footer or privacy page. Basic consent
mode sends nothing to Google before analytics consent. The separate private D1
tracker remains unchanged.

The website installs the direct Google tag (`gtag/js?id=G-9LBLJXN92D`), not a
Google Tag Manager container. There is no `GTM-` container ID, `gtm.js` loader or
`gtm.html` iframe in the site. Publishing a GTM container does not install it on
the website; do not add one alongside this integration without replacing and
reviewing the existing tracking ownership.

Only the following custom event names are sent, without booking fields:
`booking_button_click`, `booking_step_1`, `booking_step_2`, `booking_step_3`,
`booking_terms_accepted`, `generate_lead`. Each step and terms acceptance is
sent at most once per opened form. `generate_lead` is sent once per successful
server booking ID within the document lifetime, even across repeated responses
or form remounts. The ID is kept only in memory and is never sent to Google.
No failed or unconfirmed submission is counted. The form's existing request key
and server-side idempotency remain unchanged.
Consent given partway through records the currently displayed step, not earlier
activity. Consent or browser blocking and network errors can lead to fewer leads
in GA4 than stored enquiries. An enquiry is not a confirmed reservation.

Page locations contain the public origin, allowlisted path and reviewed
campaign parameters; referrers contain only the origin. After analytics consent,
the public address is sanitized with history.replaceState BEFORE Google is
loaded or enabled. This preserves Next.js history state and does not create a
new browser history entry. Unknown parameters and fragments are removed from
the address because the Google tag can inspect it independently of page_location.
No public page reads query parameters for booking or pricing. Private routes,
including recovery and conversation tokens, are never sanitized or tracked.

The exact public UTM labels allowed for source, medium, campaign, ID, content
and term are in `campaignValues` in `src/lib/analytics/google.ts`. Common sources
and media and a small set of public campaign labels are included. Add the actual
public labels used in advertising here before launching a new campaign. Unknown
labels are omitted while the visit still counts. Free-text labels cannot safely
be accepted based only on a regex: a person's name is also a valid slug.
Syntactically valid `gclid`, `gbraid`, and `wbraid` values are retained only with
marketing consent. Without marketing consent the ad identifiers are removed,
so later granting marketing consent cannot recover that initial ad click.
Google still processes technical and pseudonymous identifiers as part of its
service. No booking details, names, contact information, booking IDs or values
are passed to the Google tag.

Manual page views are deduplicated centrally by pathname, including repeated
effects/remounts, query-only changes and consent updates. A real transition to
another public pathname and back counts a new view. Automatic history-based
page views are a separate GA4 account setting and MUST be disabled as below;
`send_page_view: false` alone does not disable those events.

## Required Google settings before publishing

Read-only audit on 12 November 2026: the public `gtag/js?id=G-9LBLJXN92D`
response no longer included the GA4 automatic history page-view or form-
interaction configuration. Scrolls, outbound clicks, video engagement and file
downloads were present, matching the settings supplied for this release. A
separate Google-tag user-provided-data configuration was still visible in the
public response (`__ogt_1p_data_v2`). This may be a shared-tag setting or a
propagation/account configuration rather than an observed form-data hit, but it
must be reconciled in the Google tag/GTM account before publication because the
site intentionally sends no user data. Email redaction was also enabled.
The owner subsequently reported publishing GTM Version 2 with the three settings
disabled. A fresh public-tag check after that report still showed no automatic
history/form configuration and still contained `__ogt_1p_data_v2`; its presence
alone does not establish that user data is sent or processed. Keep this account
verification open for release review rather than treating the GTM publication as
installation of a second tag on the site.

The local browser audit used the actual downloaded Google runtime while routing
its transport to a local capture endpoint. It observed four `page_view` hits
for four real public pathname transitions, with no duplicate hit for query,
consent or React effect changes. It observed each of the six booking events
exactly once, and no name, email, phone, booking value, booking ID, URL token or
hash of those values in the captured payloads. Initial load and post-withdrawal
navigation produced no Google transport. This verifies the site's behavior and
payload construction; it does not replace a final GA4 DebugView/Tag Assistant
check in the user's property.

The source code cannot control settings already configured in the Google
accounts. An account administrator must check the following before activating
this integration:

- In the GA4 web stream's enhanced measurement settings, keep page views based
  on browser history changes and form interactions disabled. This code sends
  page views itself and sets `send_page_view: false`. The supplied release
  configuration also enables scrolls, outbound clicks, video engagement and
  file downloads; those are acceptable only for the site's reviewed, public
  static content and should be revisited if dynamic guest data or new media is
  added. Do not enable site search unless its query values are explicitly
  reviewed.
- In the Google tag settings, disable user-provided data capabilities and
  automatic user-provided data collection; do not enable enhanced conversions.
  The public tag audit still showed the user-provided-data configuration, so
  verify the setting has propagated across every shared Google tag/container
  before publication.
  Confirm there are no additional Google tags, connected destinations, GTM
  containers, or automatically created conversions that duplicate this setup.
- Enable GA4 email data redaction as an additional safeguard, and review the
  property retention, data sharing, transfers, privacy notice and consent copy.
  Check the separate D1 session timestamp's legal basis independently.
- Link the correct GA4 property to the Google Ads account, turn on Ads
  auto-tagging and mark `generate_lead` as a GA4 key event. Create a conversion
  in Google Ads based on that key event, set it to Primary in the applicable
  account/campaign goals, and ensure no other Primary conversion counts the same
  enquiry. The other five events are for funnel analysis, not Ads conversions.
  Consider the 'One' counting setting for leads. The account may take time to
  display a newly created event or imported conversion.
- In GA4 Explorations, create a funnel in the event order shown above. Booking
  button clicks are optional for direct visitors to `/booking`; use an open
  funnel if direct entry should be included. Steps are counted once per form,
  so moving back and forward will not create extra step events.

## Local verification before release

Use a separate GA4 test stream or take care not to contaminate production data.
Tracking on localhost is disabled unless `NEXT_PUBLIC_GA4_PREVIEW=true` is set
before starting the dev server or build. With this setting it uses the production
measurement ID, so use Tag Assistant/debug filtering and remove test data where
appropriate. Preview booking runs only with the documented local preview setup;
it does not send email. Never test a real booking on production.

1. Start the local preview. In a private browser session inspect network traffic:
   no request to Google is made on initial load or after Reject all; the private
   `/api/analytics` request still works independently.
2. In settings choose Analytics only, confirm the consent state has ad fields
   denied, and check one `page_view` per public page transition. Change the
   settings and verify withdrawal immediately stops subsequent events.
3. Accept both purposes, click the main Book now button, progress through the
   three steps, actively accept terms and submit a local preview enquiry.
   Check the six named events and their order in Tag Assistant / GA4 DebugView.
   Go back and forward or toggle terms to verify no duplicates.
4. Test rejected/failed booking submission and a repeated request: no lead for a
   failure, and at most one after a confirmed success. Check the request payloads
   have no form values, names, email, phone, dates, price or unreviewed URL values.
5. Test a URL with Google click IDs and the reviewed UTM labels, plus a dummy
   email in another parameter or fragment. Before consent no Google request or
   address change is allowed. After consent only the reviewed campaign values
   may remain in both the public address and the Google payload. Check private
   routes are neither changed nor tracked. Test both languages and mobile.

The local test harness can stub the Google script and booking API to verify
browser behavior without contacting Google or creating a real enquiry. Final
Tag Assistant/DebugView and real network-payload checks require the user's GA4
account and the required account settings above.
