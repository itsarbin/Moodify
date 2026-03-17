const jwt = require('jsonwebtoken');
const blackListModel = require('../model/blackList.model');
const redis = require('../config/cache');


const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const isBlackListed = await redis.get(token);
    if(isBlackListed){
        return res.status(401).json({
            message: 'Token is blacklisted, please login again'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Invalid token',
            error: err.message
        })
    }

}

module.exports = authUser;