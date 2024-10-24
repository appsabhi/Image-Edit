const express = require("express");
const Router = express.Router();
const enhance_controller = require("../Controllers/enhancement_controller");
const remove_bg_controller = require("../Controllers/background_remover_controller");
const filter_controller = require("../Controllers/image_filtering_controller");
const upload = require("../util/multer");

Router.get("/", enhance_controller.get_home);
Router.post(
  "/enhance",
  upload.single("image"),
  enhance_controller.upload_and_enhance_image
);
Router.post(
  "/remove_bg",
  upload.single("image"),
  remove_bg_controller.remove_bg
);
Router.post(
  "/image_filter",
  upload.single("image"),
  filter_controller.filter_image
);

module.exports = Router;
