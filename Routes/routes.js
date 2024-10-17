const express = require("express")
const Router = express.Router()
const controller = require("../Controllers/controller")
const upload = require("../util/multer")


Router.get("/",controller.get_home)
Router.post("/",upload.single('image'),controller.upload_and_enhance_image)

module.exports=Router