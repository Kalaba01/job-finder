const cron = require("node-cron");
const jobAdsService = require("../services/jobAdsService");

// Schedule a daily task to check for expired job ads
exports.scheduleJobAdExpirationCheck = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running an ad expiration check...");
    try {   
      const closedAdsCount = await jobAdsService.closeExpiredJobAds();
      console.log(`Closed ads: ${closedAdsCount}`);
    } catch (error) {
      console.error("Error starting cron job:", error);
    }
  });
};
