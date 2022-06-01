const {Router}=require('express');
const { serializerUserResponse } = require('../auth/auth.serializers');
const { authorize } = require('../middlewares/authorize.middleware');
const upload = require('../middlewares/upload');
const { getCurrentUser, updateAvatar, verificationUserToken ,verifyUser} = require('./users.service');
const userRouter = Router();

userRouter.get('/current', authorize(), async(req,res, next) => {

    const user = await getCurrentUser(req.userId)
    res.status(200).send(serializerUserResponse(user))
}) 

userRouter.patch("/avatars",authorize(), upload.single('avatar') ,  async(req,res,next)=>{
   
const updateUserByAvatar = await updateAvatar(req.userId , req.file ) 
   
    res.status(200).send(`${updateUserByAvatar}`)
})

userRouter.post('/verify', async(req,res,next)=>{

    await verifyUser(req.body,res);
  res.status(200).json({ message: "Verification email sent" });
    })

userRouter.get('/verify/:verificationToken', async(req,res,next)=>{
    const verificationToken = req.params.verificationToken;

  await verificationUserToken(verificationToken);
res.status(200).send('Verification successful')
})

exports.userRouter=userRouter