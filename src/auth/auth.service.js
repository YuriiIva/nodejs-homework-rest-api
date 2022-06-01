const { UserModel } = require("../db/users.model");
const {Conflict, NotFound, Forbidden, UnauthorizedError} = require('http-errors');
const bcryptjs = require("bcryptjs");
const {getConfig }= require('../config');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require("uuid");
// const res = require("express/lib/response");
const jwt = require ('jsonwebtoken')


const signUp = async (userParams, res)=> {
    
    const {username, email, password}= userParams;
const existingUser = await UserModel.findOne({email})

if(!!existingUser) {
    
    return res.status(409).json({ message: "Email in use" });
    // throw new Conflict('Email in use')
}

const {bcryptCostFactor} = getConfig();
 const hashPassord = await bcryptjs.hash(password, bcryptCostFactor);

 const url = gravatar.url("email");
 const verificationToken = uuidv4();
 

 const user = await UserModel.create({
     username, email, password: hashPassord, avatarURL: url, verificationToken
 })

 return user
}

const signIn = async(loginParams,res)=> {
    const { email, password}= loginParams;
    const user = await UserModel.findOne({email})

    if(!user) {
        throw new NotFound(' User not found')
    }
    if (user.verify === false) {
        return res.json({message: "You must confirm your email to log in"});
      }

    const isPassworCorrect = await bcryptjs.compare(password, user.password)

    if(!isPassworCorrect) {
        throw new Forbidden('This password is not correct')
    }

const token = createToken(user)

user.token = token;
  await user.save();
  
 return {user , token}
}

const createToken = (user) => {
    const config = getConfig();
    return jwt.sign({uid: user.id}, config.jwt.secret,{expiresIn: config.jwt.expiresIn})
}

module.exports ={
    signUp,
    signIn
}