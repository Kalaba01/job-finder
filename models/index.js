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
  File
};
