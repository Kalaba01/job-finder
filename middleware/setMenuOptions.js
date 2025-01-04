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
          { name: translate("AdminMenu.reviewsManagement"), link: "/admin/reviews" },
          { name: translate("AdminMenu.massNotifications"), link: "/admin/notifications" },
          { name: translate("AdminMenu.ticketManagement"), link: "/admin/tickets" }
        ];
        break;
  
      case "firm":
        res.locals.menuOptions = [
          { name: translate("FirmMenu.profile"), link: "/firm/profile" },
          { name: translate("FirmMenu.jobAds"), link: "/firm/job-ads" },
          { name: translate("FirmMenu.applications"), link: "/firm/applications" },
          { name: translate("FirmMenu.hiringProcess"), link: "/firm/hiring-process" },
          { name: translate("FirmMenu.reviews"), link: "/firm/reviews" },
          { name: translate("FirmMenu.tickets"), link: "/firm/tickets" }
        ];
        break;
  
      case "candidate":
        res.locals.menuOptions = [
          { name: translate("CandidateMenu.profile"), link: "/candidate/profile" },
          { name: translate("CandidateMenu.myApplications"), link: "/candidate/applications" },
          { name: translate("CandidateMenu.hiringProcess"), link: "/candidate/hiring-process" },
          { name: translate("CandidateMenu.tickets"), link: "/candidate/tickets" },
          { name: translate("CandidateMenu.companyReviews"), link: "/candidate/reviews" }
        ];
        break;
  
      default:
        res.locals.menuOptions = [];
        break;
    }
  
    next();
};
