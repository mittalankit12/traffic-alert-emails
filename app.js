const sgMail = require("@sendgrid/mail");
const axios = require("axios");
require("dotenv").config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TRAFFICVERKET_AUTH_KEY = process.env.TRAFFICVERKET_AUTH_KEY;
const TRAFFICVERKET_API_URL = process.env.TRAFFICVERKET_API_URL;
const EMAIL_TEMPLATE_ID = process.env.EMAIL_TEMPLATE_ID;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL;
const TRAFFIC_HEATMAP_URL = process.env.TRAFFIC_HEATMAP_URL;

// Function to fetch traffic data
async function fetchTrafficData(apiUrl, xmlData, headers) {
  try {
    const response = await axios.post(apiUrl, xmlData, { headers });
    return response.data.RESPONSE.RESULT[0].TravelTimeRoute;
  } catch (error) {
    console.error("Error in fetchTrafficData:", error.message);
    throw error;
  }
}

// Function to send an email using SendGrid
async function sendEmail(apiKey, emailData) {
  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send(emailData);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error in sendEmail", error.toString());
  }
}

// Main function to orchestrate the process
async function main() {
  const xmlData = `
  <REQUEST>
  <LOGIN authenticationkey="${TRAFFICVERKET_AUTH_KEY}" />
  <QUERY sseurl="false" objecttype="TravelTimeRoute" orderby="AverageFunctionalRoadClass" schemaversion="1.5" limit="5">
      <INCLUDE>AverageFunctionalRoadClass</INCLUDE>
      <INCLUDE>Id</INCLUDE>
      <INCLUDE>Name</INCLUDE>
      <INCLUDE>Speed</INCLUDE>
      <INCLUDE>TrafficStatus</INCLUDE>
      <FILTER>
          <LT name="AverageFunctionalRoadClass" value="5" />
          <EQ name="TrafficStatus" value="heavy" />
      </FILTER>
  </QUERY>
  </REQUEST>
  `;

  // Define the API endpoint for traffic data
  const apiUrl = TRAFFICVERKET_API_URL;

  // Set the headers for the request
  const headers = {
    "Content-Type": "application/xml",
  };

  try {
    const trafficData = await fetchTrafficData(apiUrl, xmlData, headers);

    // Uncomment the following section if you want to send a SendGrid email
    const sendGridApiKey = SENDGRID_API_KEY;
    const emailMsg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      templateId: EMAIL_TEMPLATE_ID,
      dynamic_template_data: {
        subject: "Traffic situation",
        preheader: "Beware",
        name: "Sheldon",
        message: "Hello, this is a test email!",
        imageUrl: TRAFFIC_HEATMAP_URL,
        trafficData: trafficData,
      },
    };
    await sendEmail(sendGridApiKey, emailMsg);
  } catch (error) {
    console.error("Error in main process:", error.message);
  }
}

main();
