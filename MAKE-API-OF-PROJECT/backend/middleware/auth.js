const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log(req.body , "auth")
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ message: "Authorization token required" });
    }

    // Extract the token after "Bearer"
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Pass the decoded user details (from token) to the request object
    req.body.todoid = decoded.user._id; // User's ID for database queries
    req.body.email = decoded.user.email; // User's email if needed in requests
    req.body.password = decoded.user.password; // User's email if needed in requests

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = auth;