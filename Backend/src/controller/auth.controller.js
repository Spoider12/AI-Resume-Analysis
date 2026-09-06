const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklist.model");

const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
/**
 * 
 *@name registerUserController 
 *@description register a new user ,expects username,email and password in the required
 *@access Public 
 */

async function registerUserController(req,res){
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    const userExists = await userModel.findOne({
        $or:[{username},{email}]

    })
    if(userExists){
        return res.status(400).json({message:"User already exists"})
    } 
    const hash = await bcrypt.hash(password, 10)
    const user  = await userModel.create({
        username,
        email,
        password: hash
    })
    const token =  jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token", token, tokenCookieOptions)

    res.status(201).json({
        message: "User registered sucessfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
/**
 * 
 *@name loginUserController 
 *@description login an existing user ,expects email and password in the required
 *@access Public 
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, tokenCookieOptions);

    return res.status(200).json({
      message: "User Logged in Successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
/**
 * @name logoutUserController
 * @description logout a user by blacklisting the token and clearing the cookie
 * @access Public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token

    if(token){
        await blacklistModel.create({token})
    }

    res.clearCookie("token", tokenCookieOptions)
    res.status(200).json({
        message: "User logged out successfully"
    })
}
/**
 * @name getMeController
 * @description get the logged in user details
 * @access Private
 */
async function getmeController(req,res){
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email
        })
    } catch (error) {
        console.error("GET_ME_ERROR:", error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getmeController,
}