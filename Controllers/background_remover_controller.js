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
        cloudName: "long-shadow-ed89a9",
        zone: "OxsAhh",
        version: "v2",
        transformations: [{ name: "bg", plugin: "erase" }],
        filePath: `/${result.path}/${result.name}`,
        baseUrl: "https://cdn.pixelbin.io",
      };

      const removed_url = Pixelbin.url.objToUrl(obj);

      if (removed_url) {
        return res.json({ success: true, image_url: removed_url });
      }
      else{
         let res =  await fetch(removed_url,{
          method:"GET"
         })
    let msg = await res.json()
   console.log(msg)
      }
    } catch (error) {
      
      return res.status(500).json({ error: error.message });

    }
  },
};
