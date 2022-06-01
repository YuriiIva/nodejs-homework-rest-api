const path = require ('path')
const fs = require("fs").promises;
const Jimp = require('jimp');
const dotenv = require('dotenv')

dotenv.config({path: path.join(__dirname, ".env")})
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY)
// sgMail.setApiKey('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')


const {NotFound,InvalidUserDataError,ValidationError}= require('http-errors')
const { UserModel } = require("../db/users.model")

const NEW_FILE_DIR = path.resolve(process.cwd(), "public/avatars");
console.log('NEW_FILE_DIR', NEW_FILE_DIR)

const getCurrentUser = async(userId)=>{

    const user = await UserModel.findById(userId);
    if(!user){
        throw new NotFound("Not authorized")
    }
    return user;
}

const updateAvatar = async(id,file)=>{
    const {path:pathFile, filename}= file;
    const newFileName = path.join(NEW_FILE_DIR, filename);

    await Jimp.read(pathFile)
    .then((image) => {
      image.resize(250, 250);
      image.write(pathFile);
    })
    .catch((err) => {
      return new Error(err.message);
    });

    try {
        await fs.rename(pathFile, newFileName);
      } catch (err) {
        await fs.unlink(pathFile);
        return new Error("Somesing went wrong!");
      }

    const updateUserAvatar = await UserModel.findOneAndUpdate({_id:id},   { avatarURL: newFileName} , {
        new: true,
      });
      return updateUserAvatar

}

const verifyUser = async(body)=>{
  const { email } = body;

  if (!email) {
    throw new ValidationError("Missing required field email");
  }

  const user = await UserModel.findOne({ email });

  if (user.verify === true) {
    throw new ValidationError("Verification has already been passed");
  }
 

  const msg = {
    to: email,
    from: "ivaschenko_u@ukr.net",
    subject: "Сonfirm your mail",
    text: "link for email verification",
    html: `<strong>Link for email verification :</strong><a href="http://localhost:3000/api/users/verify/${user.verificationToken}">go for confirmation</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

}

const verificationUserToken = async(userToken)=>{
  const user = await UserModel.findOne({ userToken });
  console.log('user', user)
 

  if (!user) {
    throw new InvalidUserDataError("User not found");
  }

  // const updateUserVarificationToken = await UserModel.updateOne({varificationToken:userToken},{ verificationToken: null, verify: true
  // } , {
  //   new: true,
  // });
  // console.log('updateUserVarificationToken', updateUserVarificationToken)
  // return updateUserVarificationToken

  // user.verificationToken = "null";
  // user.verify = true;

  // await user.save();
  user.verificationToken = "null";
  user.verify = true;

  await user.save();

}

module.exports ={
    getCurrentUser,
    updateAvatar,
    verificationUserToken,
    verifyUser

}
// exports.getCurrentUser=getCurrentUser