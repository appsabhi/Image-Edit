require("dotenv").config();
const axios = require("axios");

module.exports = {
  filter_image: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let base64String = req.file.buffer.toString("base64");
      let req_body = { base64: `data:image/jpeg;base64,${base64String}` };

      let response = await axios.post(
        'https://api2.cartoonize.net/api/effects/fxcartoon/1?socketId=p3eA-rwtNJOJewE0ADAW',
        req_body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      let { base64 } = response.data;

      // let imageBuffer = Buffer.from(base64, 'base64');

      //   // Set headers for file download
      //   res.setHeader("Content-Disposition", "attachment; filename=filtered_image.jpg");
      //   res.setHeader("Content-Type", "image/jpeg");

        

      if (base64) {
        return res.json({
          success: true,
          filtered_image: base64,
        });
      } else {
        return res.json({ success: false, message: "Image processing failed" });
      }
    } catch (error) {
      console.log("Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },
};
