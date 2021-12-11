const { JWT_SECRET } = require("../secrets"); // use this secret!
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  const token = req.headers.authorization  // how do we know where to get this token???
  if (!token) {
    return res.status(401).json({ "message": "token required" })
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ "message": "token invalid" })  // token is expired, or the signature doesn't match, 
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
};
