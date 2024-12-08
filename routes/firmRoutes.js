const express = require("express");
const router = express.Router();
const { isAuthenticated, isFirm } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, isFirm, (req, res) => {
  const menuOptions = [
    { name: "Create Job Ad", link: "/firm/create-job-ad" },
    { name: "My Job Ads", link: "/firm/job-ads" },
    { name: "Candidates", link: "/firm/candidates" },
    { name: "Interview Calendar", link: "/firm/calendar" },
    { name: "Reports", link: "/firm/reports" },
    { name: "Reviews", link: "/firm/reviews" },
    { name: "Tickets", link: "/firm/tickets" }
  ];
  res.render("firm", { menuOptions, locale: req.getLocale() });
});

module.exports = router;
