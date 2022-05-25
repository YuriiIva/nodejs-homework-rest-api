const multer = require("multer")
const path = require ("path")
const {uid }= require ("uid")

const upload = multer({storage: multer.diskStorage({
    destination: "public/avatars",
    filename: (req, file, cd)=> {
      const ext = path.extname(file.originalname)
      console.log('ext', ext)
      return  console.log('file', cd(null,`${uid(4)}${ext}`))
    }
  })})

  module.exports = upload;