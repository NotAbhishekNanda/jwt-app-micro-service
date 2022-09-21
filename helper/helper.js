const jwt = require('jsonwebtoken');
const { isJwtExpired } = require('jwt-check-expiration');

function isAuthenticated(req, res, next) {
  try {
    let token = req.get('authorization');
    console.log('isExpired is:', isJwtExpired(token));
    
    if (!token) {
      return res.status(404).json({ success: false, msg: 'Token not found' });
    }

    // if (isJwtExpired(token) === true) {
    //   console.log("Inside true block")
    //   const { username, refreshToken } = req.body;
    //   const isValid = verifyRefresh(username, refreshToken);
    //   if (!isValid) {
    //     console.log("Inside isvalid");
    //     return res
    //       .status(401)
    //       .json({ success: false, error: 'Invalid token,try login again' });
    //   }
    //   const accessToken = jwt.sign({ username: username }, 'a1b2c3d1e2f3', {
    //     expiresIn: '20m',
    //   });
    //   // res.set('access_token', accessToken);
    //   next();
    // }
    console.log("not coming here");
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, 'a1b2c3d1e2f3');
    req.username = decoded.username;
    req.password = decoded.password;
    next();
  } catch (error) {
    // return res.status(401).json({ success: false, msg: error.message });
    if(error.message === "jwt expired"){
      const { username, refreshToken } = req.body;
      const isValid = verifyRefresh(username, refreshToken);
      if (!isValid) {
        console.log("Inside isvalid");
        return res
          .status(401)
          .json({ success: false, error: 'Invalid token,try login again' });
      }
      const accessToken = jwt.sign({ username: username }, 'a1b2c3d1e2f3', {
        expiresIn: '1m',
      });
      res.set('access_token', accessToken);
      next();
    }
    else{
      return res.status(401).json({ success: false, msg: error.message });
    }
    // console.error(error);
  }
}

function verifyRefresh(username, token) {
  try {
    const decoded = jwt.verify(token, 'refreshSecret');
    return decoded.username === username;
  } catch (error) {
    // console.error(error);
    return false;
  }
}

module.exports = { isAuthenticated, verifyRefresh };
