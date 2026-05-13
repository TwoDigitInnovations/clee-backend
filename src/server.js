require("module-alias/register");
require("dotenv").config();

const app = require("./app");
const { startBookingCronJob } = require("./services/bookingCronJob");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Start cron jobs
  startBookingCronJob();
});
