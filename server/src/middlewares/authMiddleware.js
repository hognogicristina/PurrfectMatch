const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, RefreshToken, Token } = require("../../models");
const validation = require("../validators/authValidator");
const logger = require("../../logger/logger");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(404)
      .json({ error: [{ field: "token", message: "No token provided" }] });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: [{ field: "user", message: "User not found" }] });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error(error);
      return res
        .status(401)
        .json({ error: [{ field: "token", message: "Token expired" }] });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.error(error);
      return res.status(403).json({
        error: [{ field: "token", message: "Failed to authenticate token" }],
      });
    } else {
      logger.error(error);
      return res.status(500).json({
        error: [{ field: "server", message: "Internal Server Error" }],
      });
    }
  }
};

const authenticateLogin = async (req, res, next) => {
  try {
    if (await validation.loginValidation(req, res)) return;

    const { usernameOrEmail, password } = req.body;
    let user;
    user = await User.findOne({ where: { username: usernameOrEmail } });
    if (!user) {
      user = await User.findOne({ where: { email: usernameOrEmail } });
    }

    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!user || !isPasswordValid) {
      return res.status(401).json({
        error: [{ field: "user", message: "Invalid user or password" }],
      });
    }

    if (user && user.status === "active_pending") {
      const tokenUser = await Token.findOne({
        where: { userId: user.id, type: "activation" },
      });
      if (tokenUser && new Date() > new Date(tokenUser.expires)) {
        return res.status(401).json({
          error: [
            {
              field: "expired",
              message: "Unfortunately, your activation link has expired",
            },
          ],
        });
      }
    }

    if (user) {
      const refreshToken = await RefreshToken.findAll({
        where: { userId: user.id },
      });
      if (refreshToken) {
        return res.status(401).json({
          error: [{ field: "user", message: "You are already logged in" }],
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

const validateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: [
          { field: "refreshToken", message: "Refresh token is required" },
        ],
      });
    }

    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!token) {
      return res.status(401).json({
        error: [{ field: "refreshToken", message: "Invalid refresh token" }],
      });
    }

    const user = await User.findByPk(token.userId);
    if (!user) {
      return res
        .status(401)
        .json({ error: [{ field: "user", message: "User not found" }] });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: [{ field: "server", message: "Internal Server Error" }] });
  }
};

module.exports = { authenticateToken, authenticateLogin, validateRefreshToken };
