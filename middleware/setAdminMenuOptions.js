module.exports = (req, res, next) => {
  res.locals.menuOptions = [
    { name: "User Management", link: "/admin/users" },
    { name: "Company Approvals", link: "/admin/company-approvals" },
    { name: "Job Ads", link: "/admin/job-ads" },
    { name: "Reports", link: "/admin/reports" },
    { name: "Reviews Management", link: "/admin/reviews" },
    { name: "Mass Notifications", link: "/admin/notifications" },
    { name: "Ticket Management", link: "/admin/tickets" },
  ];
  next();
};
