const { DOMParser } = require("xmldom");
const crypto = require("crypto");

function generatecsrftoken() {
  const randomString = crypto.randomBytes(16).toString("hex"); // 32-character hex string

  // Create a timestamp
  const timestamp = Date.now().toString(); // Current timestamp as a string

  // Create a hash using SHA-256
  const hash = crypto
    .createHash("sha256")
    .update(randomString + timestamp)
    .digest("hex"); // Hash of the random string and timestamp

  // Return the token in the expected format
  return `${randomString}.${hash}`;
}

module.exports = {
  get_home: (req, res) => {
    res.render("home");
  },

  upload_and_enhance_image: async (req, res) => {
    try {
      CSRFtoken = generatecsrftoken();

      //   first Request //
      console.log(req.body);
      let { bucket, content_type } = req.body;

      let formdata = new FormData();

      formdata.append("bucket", bucket);
      formdata.append("content_type", content_type);

      formdata.append("CSRFtoken", CSRFtoken);

      let first_response = await fetch(
        "https://www.befunky.com/api/direct-upload/",
        {
          method: "POST",
          body: formdata,
        }
      );
      let data = await first_response.json();

      //   first Request //

      if (data.data && data.data.inputs) {
        let inputs = data.data.inputs;

        // second request //

        const imagefile = new Blob([req.file.buffer], {
          type: req.file.mimetype,
        });

        let formData = new FormData();

        formData.append("Content-Type", inputs["Content-Type"]);
        formData.append("acl", inputs.acl);
        formData.append("policy", inputs.policy);
        formData.append("success_action_status", inputs.success_action_status);
        formData.append("X-amz-credential", inputs["X-amz-credential"]);
        formData.append("X-amz-algorithm", inputs["X-amz-algorithm"]);
        formData.append("X-amz-date", inputs["X-amz-date"]);
        formData.append("X-amz-signature", inputs["X-amz-signature"]);
        formData.append("Cache-Control", inputs["Cache-Control"]);
        formData.append("key", inputs.key);
        formData.append("file", imagefile, req.file.originalname);

        let second_response = await fetch(
          "https://ai-direct-upload.s3-accelerate.amazonaws.com",
          {
            method: "POST",
            body: formData,
          }
        );

        let new_data = await second_response.text();

        let parse = new DOMParser();
        let xmldata = parse.parseFromString(new_data, "text/xml");

        const location =
          xmldata.getElementsByTagName("Location")[0].textContent;

        console.log("Location:", location);

        // second request //

        if (xmldata && location) {
          // Third Response //

          let final_formdata = new FormData();

          final_formdata.append("method", "api/auto-enhancer/");
          final_formdata.append("image", location);
          final_formdata.append(
            "CSRFtoken",
            "64381e528e7c7a9b9f69f4499d274904.9787bfa35a80724553b7be2700aaf34829b601f4b6a284edc749973b002aabbe"
          );
          final_formdata.append("model", "enhancer");
          let csrf_token =
            "CSRFtoken=64381e528e7c7a9b9f69f4499d274904.9787bfa35a80724553b7be2700aaf34829b601f4b6a284edc749973b002aabbe";

          let urlencoded = new URLSearchParams(final_formdata).toString();

          let final_response = await fetch(
            "https://upload.befunky.com/artsy/",
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-csrf-token":
                  "64381e528e7c7a9b9f69f4499d274904.9787bfa35a80724553b7be2700aaf34829b601f4b6a284edc749973b002aabbe",
                cookie: csrf_token,
              },
              body: urlencoded,
              method: "POST",
            }
          );

          let { data } = await final_response.json();

          console.log(data.image);
          console.log(data.original_img);
          console.log(data.success);

          // Third Response //

          if (data.success === true) {
            return res.json({
              success: true,
              updated_img: data.image,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.redirect("/");
    }
  },
};
