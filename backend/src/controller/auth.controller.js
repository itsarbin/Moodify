const userModel = require('../model/user.model');
const blackListModel = require('../model/blackList.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie('token', token);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }

        })
    } catch (err) {
        res.status(500).json({
            message: 'Error registering user',
            error: err.message
        })
    }

}

const login = async (req, res)=> {
    const {username, email, password} = req.body;
    try{
        const user = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if(!user){
            return res.status(400).json({
                message: 'Invalid email or username'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: 'Invalid password'
            });
        }

        const token = jwt.sign({ id:user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie('token', token);
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error logging in',
            error: err.message
        })
    }

}

const getMe = async (req,res)=>{

    const userId = req.user.id;
    try{
        const user = await userModel.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User details fetched successfully',
            user
        })
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching user details',
            error: err.message
        })
    }
}

const logout = async(req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({
            message: 'No token found'
        });
    }
    res.clearCookie('token');

    await blackListModel.create({
        token
    })

    
    res.status(200).json({
        message: 'Logout successful'
    });
}


module.exports = {
    register,
    login,
    getMe,
    logout   
}
