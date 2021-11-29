const User = require('../models/User')
const {statusCode, StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const getAllUser = async (req,res) =>{
    console.log(req.user);
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({ users })
} 
const getSingleUser = async (req,res) =>{
    const user = await User.findOne({_id : req.params.id}).select('-password')
    if(!user){
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ user })
} 
const showCurrentUser = async (req,res) =>{
    res.status(StatusCodes.OK).json({user:req.user})
} 
const updateUser = async (req,res) =>{
    res.send("update User");
} 
const updateUserPassword = async (req,res) =>{
    const {oldPassword,newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('Please provide both values')
    }
    const user = await User.findOne({_id:req.user.userId})
    const isPasswordCorrect = user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword

    await user.save();
    res.status(StatusCodes.OK).json({msg:"Success! Password Updated"})
} 
 
module.exports =
{
    getAllUser,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}