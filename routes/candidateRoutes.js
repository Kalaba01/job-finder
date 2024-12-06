const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const menuOptions = [
    { name: "My Profile", link: "/candidate/profile" },
    { name: "Job Ads", link: "/candidate/job-ads" },
    { name: "My Applications", link: "/candidate/applications" },
    { name: "Interview Calendar", link: "/candidate/calendar" },
    { name: "Tickets", link: "/candidate/tickets" },
    { name: "Company Reviews", link: "/candidate/reviews" }
  ];
  res.render("candidate", { menuOptions, locale: req.getLocale() });
});

module.exports = router;
