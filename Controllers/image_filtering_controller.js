require("dotenv").config();
const { DOMParser } = require("xmldom");
const crypto = require("crypto");
const { response } = require("express");

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
  filter_image: async (req, res) => {
    try {
      let CSRFtoken = generatecsrftoken();

      let formdata = new FormData();

      formdata.append("bucket", "artsyupload");
      formdata.append("content_type", "image/jpeg");
      formdata.append("CSRFtoken",CSRFtoken );

      let first_response = await fetch(
        "https://www.befunky.com/api/direct-upload/",
        {
          method: "POST",
          body: formdata,
        }
      );
      let data = await first_response.json();
      
      // console.log("first",data.data.inputs)

      if (data.data && data.data.inputs) {
        let inputs = data.data.inputs;

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
          "https://artsyupload.s3-accelerate.amazonaws.com/",
          {
            method: "POST",
            body: formData,
          }
        );


        console.log("second _main",second_response)
        let new_data = await second_response.text();

        //  console.log("second",new_data)

        let parse = new DOMParser();
        let xml_data = parse.parseFromString(new_data, "text/xml");
        

        // console.log("xml",xml_data)

        let location = xml_data.getElementsByTagName("Location")[0].textContent;
    // console.log(location)
        if (xml_data && location) {
          // Third Response //

          let final_formdata = new FormData();
          
          final_formdata.append("method", "befunky.runTemplateEffect");
          final_formdata.append("template_id", "ART_0001");
          final_formdata.append("url", location);
          final_formdata.append("CSRFtoken","55731a1c54b180f5f7d0beaa75b97480.5daab195ea348cd5ef08e4ae0c74cb08ca972fc523eea016c439b68f7077a40c");
          // final_formdata.append("adjustment", "10");
          // final_formdata.append("sharpen", "0");
          // final_formdata.append("vm", "5");
          final_formdata.append("adjustment",JSON.stringify({ vm: "0", sharpen: "0" }));

          let csrf_token ="CSRFtoken=55731a1c54b180f5f7d0beaa75b97480.5daab195ea348cd5ef08e4ae0c74cb08ca972fc523eea016c439b68f7077a40c";
           

            console.log('last-form',final_formdata)

          

          let final_response = await fetch(
            "https://upload.befunky.com/artsy/",
            {
              headers: {
                "x-csrf-token":
                  "55731a1c54b180f5f7d0beaa75b97480.5daab195ea348cd5ef08e4ae0c74cb08ca972fc523eea016c439b68f7077a40c",
                cookie: csrf_token,
              },

              body: final_formdata,
              method: "POST",
            }
          );
          console.log("final",final_response)

          let data = await final_response.json();
          console.log("data",data)
          // Third Response //

          if (data.data) {
            return res.json({
              success: true,
              filtered_image: data.data.url,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },
};
