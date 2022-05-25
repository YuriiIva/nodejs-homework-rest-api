const {Router}=require('express');
const { serializerUserResponse } = require('../auth/auth.serializers');
const { authorize } = require('../middlewares/authorize.middleware');
const upload = require('../middlewares/upload');
const { getCurrentUser, updateAvatar } = require('./users.service');
const userRouter = Router();

userRouter.get('/current', authorize(), async(req,res, next) => {

    const user = await getCurrentUser(req.userId)
    res.status(200).send(serializerUserResponse(user))
}) 

userRouter.patch("/avatars",authorize(), upload.single('avatar') ,  async(req,res,next)=>{
   
const updateUserByAvatar = await updateAvatar(req.userId , req.file ) 
   
    res.status(200).send(`${updateUserByAvatar}`)
})

exports.userRouter=userRouter