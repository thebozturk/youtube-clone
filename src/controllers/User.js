const { IncomingForm } = require("formidable");
const bcrypt = require("bcrypt");
const { config } = require("../config");
const { verify, sign } = require("jsonwebtoken");
const { User } = require("../models/User");

class UserController {
  signup(req, res) {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      console.log({ err, fields });
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      const { username, email, password } = fields;
      const salt = bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, parseInt(salt));
      const newAccount = new User({
        username,
        email,
        password: hashedPassword,
      });

      try {
        const savedAccount = await newAccount.save();
        return res.status(201).json({
          msg: "Account created successfully",
        });
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }
    });
  }

  signin(req, res) {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err,
        });
      }

      const { account, password } = fields;
      const isAccountMail = account.includes("@");
      console.log({ isAccountMail });
      if (isAccountMail) {
        const user = await User.findOne({ email: account });
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Account not found",
          });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: "Incorrect password",
          });
        }
        const token_payload = {
          _id: user._id,
          username: user.username,
          email: user.email,
        };
        const token = sign(token_payload, process.env.COOKIE_SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          token,
        });
      }
    });
  }

  forgotPassword(req, res) {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err,
        });
      }
      const { email, password } = fields;
      if (!email || !password) {
        return res.status(401).json({
          success: false,
          message: "Email or password is missing",
        });
      }

      const salt = bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, parseInt(salt));

      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Account not found",
          });
        }
        const updatedAccount = await User.findOneAndUpdate(
          {
            email: email,
          },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        return res.status(200).json({
          msg: "Password reset successfully",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error updating account",
        });
      }
    });
  }
}

module.exports = UserController;
