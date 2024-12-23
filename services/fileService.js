const candidateService = require("./candidateService");
const { Ticket } = require("../models");

exports.getCandidateFile = async (candidateId, type) => {
  try {
    const candidate = await candidateService.findCandidateByUserId(candidateId);

    if (!candidate) throw new Error("Candidate not found");

    let fileContent;
    let fileName;
    let mimeType = "application/octet-stream";

    switch (type) {
      case "cv":
        fileContent = candidate.cv;
        fileName = `cv_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      case "motivation_letter":
        fileContent = candidate.motivation_letter;
        fileName = `motivation_letter_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      case "recommendations":
        fileContent = candidate.recommendations;
        fileName = `recommendations_${candidate.first_name}_${candidate.last_name}.pdf`;
        mimeType = "application/pdf";
        break;

      default:
        throw new Error("Invalid file type");
    }

    if (!fileContent) throw new Error("File not found");

    return {
      content: fileContent,
      fileName,
      mimeType
    };
  } catch (error) {
    console.error("Error fetching candidate file:", error);
    throw error;
  }
};

exports.getTicketAttachment = async (ticketId) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: ticketId } });

    if (!ticket) throw new Error("Ticket not found");
    if (!ticket.attachment) throw new Error("Attachment not found");

    return {
      content: ticket.attachment,
      fileName: `ticket_attachment_${ticket.id}.bin`,
      mimeType: "application/octet-stream"
    };
  } catch (error) {
    console.error("Error fetching ticket attachment:", error);
    throw error;
  }
};
