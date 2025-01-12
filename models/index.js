const sequelize = require("../config/sequelize");

const File = require("./File");
const Image = require("./Image");
const User = require("./User");
const Admin = require("./Admin");
const Firm = require("./Firm");
const Candidate = require("./Candidate");
const Review = require("./Review");
const FirmRequest = require("./FirmRequest");
const PasswordResetToken = require("./PasswordResetToken");
const Ticket = require("./Ticket");
const TicketConversation = require("./TicketConversation");
const JobAd = require("./JobAd");
const Application = require("./Application");
const HiringPhase = require("./HiringPhase");
const HiringProcess = require("./HiringProcess");
const HiringProcessCandidate = require("./HiringProcessCandidate");
const InterviewComment = require("./InterviewComment");
const InterviewInvite = require("./InterviewInvite");
const Notification = require("./Notification");

// Funkcija za definisanje asocijacija
const defineAssociations = () => {
  // TicketConversation -> User
  TicketConversation.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
  User.hasMany(TicketConversation, { foreignKey: "sender_id", as: "SentConversations" });

  // File -> Candidate
  Candidate.belongsTo(File, { foreignKey: "cv_file_id", as: "CVFile" });
  Candidate.belongsTo(File, { foreignKey: "motivation_file_id", as: "MotivationFile" });
  Candidate.belongsTo(File, { foreignKey: "recommendations_file_id", as: "RecommendationsFile" });

  // Candidate -> Image
  Candidate.belongsTo(Image, { foreignKey: "profile_picture_id", as: "CandidateProfilePicture" });

  // Candidate -> User
  Candidate.belongsTo(User, { foreignKey: "user_id", as: "CandidateUser" });
  User.hasOne(Candidate, { foreignKey: "user_id", as: "Candidate" });

  // Firm -> User
  Firm.belongsTo(User, { foreignKey: "user_id", as: "FirmUser" });
  User.hasOne(Firm, { foreignKey: "user_id", as: "Firm" });

  // Firm -> Image
  Firm.belongsTo(Image, { foreignKey: "profile_picture_id", as: "FirmProfilePicture" });

  // Admin -> User
  Admin.belongsTo(User, { foreignKey: "user_id", as: "AdminUser" });
  User.hasOne(Admin, { foreignKey: "user_id", as: "Admin" });

  // Ticket -> User
  Ticket.belongsTo(User, { foreignKey: "user_id", as: "TicketCreator" });

  // Ticket -> File
  Ticket.belongsTo(File, { foreignKey: "attachment_id", as: "Attachment" });

  // PasswordResetToken -> User
  PasswordResetToken.belongsTo(User, { foreignKey: "user_id", as: "PasswordResetUser" });

  // Review -> Firm
  Review.belongsTo(Firm, { foreignKey: "reviewed_firm_id", as: "ReviewedFirm" });

  // JobAd -> Firm
  JobAd.belongsTo(Firm, { foreignKey: "firm_id", as: "Firm" });
  Firm.hasMany(JobAd, { foreignKey: "firm_id", as: "JobAds" });

  // JobAd -> HiringProcess
  JobAd.hasMany(HiringProcess, { foreignKey: "job_ad_id", as: "RelatedHiringProcesses" });
  HiringProcess.belongsTo(JobAd, { foreignKey: "job_ad_id", as: "JobAd" });

  // Application -> JobAd
  Application.belongsTo(JobAd, { foreignKey: "job_ad_id", as: "JobAd" });
  JobAd.hasMany(Application, { foreignKey: "job_ad_id", as: "Applications" });

  // Application -> Candidate
  Application.belongsTo(Candidate, { foreignKey: "candidate_id", as: "Candidate" });
  Candidate.hasMany(Application, { foreignKey: "candidate_id", as: "Applications" });

  // HiringProcess -> HiringPhase
  HiringProcess.belongsTo(HiringPhase, { foreignKey: "current_phase", as: "CurrentPhase" });
  HiringPhase.hasMany(HiringProcess, { foreignKey: "current_phase", as: "ProcessesInPhase" });

  // HiringProcess -> JobAd
  HiringProcess.belongsTo(JobAd, { foreignKey: "job_ad_id", as: "AssociatedJobAd" });
  JobAd.hasMany(HiringProcess, { foreignKey: "job_ad_id", as: "ProcessesInJobAd" });

  // HiringProcessCandidate -> HiringProcess
  HiringProcessCandidate.belongsTo(HiringProcess, { foreignKey: "hiring_process_id", as: "HiringProcess" });
  HiringProcess.hasMany(HiringProcessCandidate, { foreignKey: "hiring_process_id", as: "CandidatesInProcess" });

  // HiringProcessCandidate -> Candidate
  HiringProcessCandidate.belongsTo(Candidate, { foreignKey: "candidate_id", as: "Candidate" });
  Candidate.hasMany(HiringProcessCandidate, { foreignKey: "candidate_id", as: "Processes" });

  // HiringProcessCandidate -> HiringPhase
  HiringProcessCandidate.belongsTo(HiringPhase, { foreignKey: "phase_id", as: "Phase" });
  HiringPhase.hasMany(HiringProcessCandidate, { foreignKey: "phase_id", as: "CandidatesInPhase" });

  // InterviewComment -> HiringProcess
  InterviewComment.belongsTo(HiringProcess, { foreignKey: "hiring_process_id", as: "HiringProcess" });
  HiringProcess.hasMany(InterviewComment, { foreignKey: "hiring_process_id", as: "Comments" });

  // InterviewComment -> HiringPhase
  InterviewComment.belongsTo(HiringPhase, { foreignKey: "phase_id", as: "Phase" });
  HiringPhase.hasMany(InterviewComment, { foreignKey: "phase_id", as: "Comments" });

  // InterviewComment -> Candidate
  InterviewComment.belongsTo(Candidate, { foreignKey: "candidate_id", as: "Candidate" });
  Candidate.hasMany(InterviewComment, { foreignKey: "candidate_id", as: "Comments" });

  // InterviewInvite -> Candidate
  InterviewInvite.belongsTo(Candidate, { foreignKey: "candidate_id", as: "Candidate" });
  Candidate.hasMany(InterviewInvite, { foreignKey: "candidate_id", as: "InterviewInvites" });

  // InterviewInvite -> Firm
  InterviewInvite.belongsTo(Firm, { foreignKey: "firm_id", as: "Firm" });
  Firm.hasMany(InterviewInvite, { foreignKey: "firm_id", as: "InterviewInvites" });

  // InterviewInvite -> JobAd
  InterviewInvite.belongsTo(JobAd, { foreignKey: "job_ad_id", as: "JobAd" });
  JobAd.hasMany(InterviewInvite, { foreignKey: "job_ad_id", as: "InterviewInvites" });

  // InterviewInvite -> HiringProcess
  InterviewInvite.belongsTo(HiringProcess, { foreignKey: "hiring_process_id", as: "HiringProcess" });
  HiringProcess.hasMany(InterviewInvite, { foreignKey: "hiring_process_id", as: "InterviewInvites" });

  // User -> Notification
  User.hasMany(Notification, { foreignKey: "user_id", as: "Notifications" });
  Notification.belongsTo(User, { foreignKey: "user_id", as: "User" });

};

defineAssociations();

module.exports = {
  sequelize,
  User,
  Admin,
  Firm,
  Candidate,
  Review,
  FirmRequest,
  Image,
  PasswordResetToken,
  Ticket,
  TicketConversation,
  File,
  JobAd,
  Application,
  HiringPhase,
  HiringProcess,
  HiringProcessCandidate,
  InterviewComment,
  InterviewInvite,
  Notification
};
