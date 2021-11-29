const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createTokenUser, attachCookiesToResponse} = require('../utils/')

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

// Update user with find one and update
// const updateUser = async (req,res) =>{
//     const {email , name} = req.body
//     if(!name || !email){
//         throw new CustomError.BadRequestError('Please provide both values')
//     }
//     const user = await User.findOneAndUpdate(
//         {_id: req.user.userId},
//         { email , name },
//         { new: true , runValidators: true}
//     )
//     const tokenUser = createTokenUser(user)
//     attachCookiesToResponse({res,user: tokenUser})
//     res.status(StatusCodes.OK).json({user:tokenUser})
// } 
//  Update user with save
const updateUser = async (req,res) =>{
    const {email , name} = req.body
    if(!name || !email){
        throw new CustomError.BadRequestError('Please provide both values')
    }
    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name =name
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user: tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
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