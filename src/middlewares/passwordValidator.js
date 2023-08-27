const passwordValidator = (req, res, next) => {
  let { password } = req.body;

  if (
    !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
  ) {
    return res.status(400).json({
      success: false,
      response: "Password too weak", // must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character
    });
  }

  return next();
};

export default passwordValidator;
