const { body, validationResult } = require("express-validator");

exports.validateCandidateRegistration = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateFirmRequest = (req, res, next) => {
  const { email, name, address, employees_range } = req.body;

  if (!email || !name || !address || !employees_range) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const employeeRangeRegex = /^\d+-\d+$/;
  if (!employeeRangeRegex.test(employees_range)) {
    return res.status(400).json({ error: 'Invalid employees range format. Use format like "10-50"' });
  }

  next();
};

exports.validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
