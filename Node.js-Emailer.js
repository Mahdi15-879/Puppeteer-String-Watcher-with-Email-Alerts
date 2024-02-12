const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

// URLs to monitor
const URLs = [
  "https://example.com",
  "https://example.org",
];

// Search strings to check for
const SEARCH_STRINGS = [
  "exampleString",
  "anotherExampleString",
];

// Email recipients
const EMAIL_RECIPIENTS = [
  "recipient1@example.com",
  "recipient2@example.com",
];

// SMTP configuration for sending email notifications
const SMTP_CONFIG = {
  service: "Gmail",
  auth: {
    user: "example@gmail.com", // Your Gmail email address
    pass: "yourAppPassword", // The app password you generated
  },
};

// Function to check for search strings on a webpage
async function checkForStrings(url) {
  // Puppeteer setup
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Get the page content
    const pageContent = await page.content();

    // Check for each search string
    for (const searchString of SEARCH_STRINGS) {
      if (pageContent.includes(searchString)) {
        console.log(`The string "${searchString}" was found on ${url}`);

        // Send email notification
        await sendEmail("Here's an example sentence that you will receive if your search string is found.");
      } else {
        console.log(`The string "${searchString}" was not found on ${url}`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Function to send email notification
async function sendEmail(message) {
  // Nodemailer setup
  const transporter = nodemailer.createTransport(SMTP_CONFIG);

  // Email options
  const mailOptions = {
    from: "example@gmail.com",
    to: EMAIL_RECIPIENTS.join(", "), // Email addresses to receive notifications
    subject: "Search String Found",
    text: message,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

// Main function to continuously monitor URLs
async function main() {
  while (true) {
    // Check each URL for search strings
    for (const url of URLs) {
      await checkForStrings(url);
    }
    // Delay before checking URLs again
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
  }
}

// Call the main function
main().catch((error) => {
  console.error("Main function error:", error);
});
