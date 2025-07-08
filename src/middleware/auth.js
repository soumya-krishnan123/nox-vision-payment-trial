const jwt = require('jsonwebtoken');
const config = require('../config/env');
const planModel = require('../models/planModel');
const crypto = require('crypto');
module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const userSession = await planModel.fetchUserSessionByToken(decoded.id, tokenHash);
    if(!userSession){
      return res.status(401).json({
        status: false,
        status_code: 401,
        message: 'Session Expired'
      });
    }
    req.user = decoded;
    
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(401).json({

      status_code: 401,
      status: false,
      message: 'Invalid or expired token'
    });
  }
};
