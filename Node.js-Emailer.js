const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

const URLs = [
  "https://safar724.com/bus/esfahan-bandarabbas?date=1402-12-02",
  "https://mrbilit.com/buses/esfahan-bandar_abbas?departureDate=1402-12-02&adultCount=5",
  "https://www.alibaba.ir/bus/IFN-64310000?departing=1402-12-02",
];

const SEARCH_STRINGS = [
  "تعداد صندلی های خالی:",
  "۱۹:۳۰",
  "صندلی باقی مانده",
  "انتخاب بلیط",
  "19:30",
];
const EMAIL_RECIPIENTS = [
  "mahdiheydari15879@gmail.com",
  "P.zahra79@gmail.com",
  "smhfakheri79@gmail.com",
];

const SMTP_CONFIG = {
  service: "Gmail",
  auth: {
    user: "mahdiheydari15879@gmail.com", // Your Gmail email address
    pass: "bjlr szas wbla fskn", // The app password you generated
  },
};

async function checkForStrings(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const pageContent = await page.content();

    for (const searchString of SEARCH_STRINGS) {
      if (pageContent.includes(searchString)) {
        console.log(`The string "${searchString}" was found on ${url}`);

        // Send email notification
        await sendEmail(
          `در تاریخ 1402/12/02 بلیط برای بندرعباس در این لینک ${url} موجود شد!`
        );
      } else {
        console.log(`The string "${searchString}" was not found on ${url}`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await browser.close();
  }
}

async function sendEmail(message) {
  const transporter = nodemailer.createTransport(SMTP_CONFIG);

  const mailOptions = {
    from: "mahdiheydari15879@gmail.com",
    to: EMAIL_RECIPIENTS.join(", "), // Email addresses to receive notifications
    subject: "بلیط بندرعباس",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

// Continuous loop to check URLs
async function main() {
  while (true) {
    for (const url of URLs) {
      await checkForStrings(url);
    }
    // Delay before checking URLs again
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second before checking again
  }
}

main().catch((error) => {
  console.error("Main function error:", error);
});
