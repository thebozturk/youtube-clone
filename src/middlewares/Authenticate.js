const { verify } = require("jsonwebtoken");

const Authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");
  verify(token, process.env.COOKIE_SECRET_KEY, (err, decoded) => {
    if (error) {
      return res.status(404).json({
        success: false,
        message: "You have to signup or login to upload a video",
      });
    }
    request.token = decoded;
    next();
  });
};

module.exports = Authenticate;
