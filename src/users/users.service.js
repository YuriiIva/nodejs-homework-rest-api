const path = require ('path')
const fs = require("fs").promises;
const Jimp = require('jimp');

const {NotFound}= require('http-errors')
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

module.exports ={
    getCurrentUser,
    updateAvatar
}
// exports.getCurrentUser=getCurrentUser