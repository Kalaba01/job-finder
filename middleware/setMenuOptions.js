module.exports = (req, res, next) => {
    if (!req.user) {
      res.locals.menuOptions = [];
      return next();
    }
  
    const role = req.user.role;
  
    const translate = res.__.bind(res);
  
    switch (role) {
      case "admin":
        res.locals.menuOptions = [
          { name: translate("AdminMenu.userManagement"), link: "/admin/users" },
          { name: translate("AdminMenu.companyApprovals"), link: "/admin/company-approvals" },
          { name: translate("AdminMenu.jobAds"), link: "/admin/job-ads" },
          { name: translate("AdminMenu.reports"), link: "/admin/reports" },
          { name: translate("AdminMenu.reviewsManagement"), link: "/admin/reviews" },
          { name: translate("AdminMenu.massNotifications"), link: "/admin/notifications" },
          { name: translate("AdminMenu.ticketManagement"), link: "/admin/tickets" },
        ];
        break;
  
      case "firm":
        res.locals.menuOptions = [
          { name: translate("FirmMenu.createJobAd"), link: "/firm/create-job-ad" },
          { name: translate("FirmMenu.myJobAds"), link: "/firm/job-ads" },
          { name: translate("FirmMenu.candidates"), link: "/firm/candidates" },
          { name: translate("FirmMenu.interviewCalendar"), link: "/firm/calendar" },
          { name: translate("FirmMenu.reports"), link: "/firm/reports" },
          { name: translate("FirmMenu.reviews"), link: "/firm/reviews" },
          { name: translate("FirmMenu.tickets"), link: "/firm/tickets" },
        ];
        break;
  
      case "candidate":
        res.locals.menuOptions = [
          { name: translate("CandidateMenu.myProfile"), link: "/candidate/profile" },
          { name: translate("CandidateMenu.jobAds"), link: "/candidate/job-ads" },
          { name: translate("CandidateMenu.myApplications"), link: "/candidate/applications" },
          { name: translate("CandidateMenu.interviewCalendar"), link: "/candidate/calendar" },
          { name: translate("CandidateMenu.tickets"), link: "/candidate/tickets" },
          { name: translate("CandidateMenu.companyReviews"), link: "/candidate/reviews" },
        ];
        break;
  
      default:
        res.locals.menuOptions = [];
        break;
    }
  
    next();
};
