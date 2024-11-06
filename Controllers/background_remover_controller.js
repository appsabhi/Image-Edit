require("dotenv").config();
const { PixelbinClient, PixelbinConfig } = require("@pixelbin/admin");
const Pixelbin = require("@pixelbin/admin");

const config = new PixelbinConfig({
  domain: "https://api.pixelbin.io",
  apiSecret: process.env.BGREMOVE_API_KEY, // Use the correct API token
});

const pixelbin = new PixelbinClient(config);

module.exports = {
  remove_bg: async (req, res) => {
    try {
      const filename = `${Date.now()}-${req.file.originalname}`;

      const result = await pixelbin.uploader.upload({
        file: req.file.buffer,
        name: filename,
        path: "/My Library/images",
        format: "jpeg",
        tags: [],
        metadata: {},
        overwrite: false,
        filenameOverride: false,
        access: "public-read",
      });

      const obj = {
        cloudName: "winter-hall-f4d3f4",
        zone: "5CbfrW",
        version: "v2",
        transformations: [{ name: "bg", plugin: "erase" }],
        filePath: `/${result.path}/${result.name}`,
        baseUrl: "https://cdn.pixelbin.io",
      };
 console.log(obj)
      const removed_url = Pixelbin.url.objToUrl(obj);
  console.log(removed_url)
      if (removed_url) {
        return res.json({ success: true, image_url: removed_url });
      }
      else{
         let res =  await fetch(removed_url,{
          method:"GET"
         })
    let msg = await res.json()
    console.log
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  },
};
