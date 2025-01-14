const { Candidate, Firm, JobAd, Application } = require("../models");

exports.getAdminStats = async () => {
  const candidatesCount = await Candidate.count();
  const firmsCount = await Firm.count();
  const jobAdsCount = await JobAd.count();
  const applicationsCount = await Application.count();

  return {
    candidates: candidatesCount || 0,
    firms: firmsCount || 0,
    jobAds: jobAdsCount || 0,
    applications: applicationsCount || 0
  };
};

exports.getFirmStats = async (firmId) => {
  const jobAdsCount = await JobAd.count({ where: { firm_id: firmId } });
  const applicationsCount = await Application.count({
    include: {
      model: JobAd,
      as: "JobAd",
      where: { firm_id: firmId }
    }
  });

  return {
    jobAds: jobAdsCount || 0,
    applications: applicationsCount || 0
  };
};
