const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  try {
    let token = req.get('authorization');

    if (!token) {
      return res.status(404).json({ success: false, msg: 'Token not found' });
    }
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, 'a1b2c3d1e2f3');
    req.username = decoded.username;
    req.password = decoded.password;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, msg: error.message });
    // console.error(error);
  }
}

function verifyRefresh(username, token) {
    try {
     const decoded = jwt.verify(token, "refreshSecret");
     return decoded.username === username;
    } catch (error) {
     // console.error(error);
     return false;
    }
   }

module.exports = { isAuthenticated, verifyRefresh };

