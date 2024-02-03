# Traffic alert emails

Get data from traffikverket and use that data to send email to user using sendgrid for notifying about the traffic situation.

## Installation

1. Clone repository
2. Install packages `npm install`
3. Setup `.env` file like below
   ```
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   TRAFFICVERKET_AUTH_KEY=<your_trafficverket_api_key>
   TRAFFICVERKET_API_URL=<trafficverket_api_url>
   EMAIL_TEMPLATE_ID=<sendgrid-email_template_id>
   TO_EMAIL=<to_email>
   FROM_EMAIL=<from_email>
   TRAFFIC_HEATMAP_URL=<image_url>
   ```
4. Run `node app.js`

   Youl will receive an email to email address provided in `TO_EMAIL`
