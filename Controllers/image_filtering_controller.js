require("dotenv").config();
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



module.exports={

filter_image:async(req,res)=>{
             
    try
    {
      let CSRFtoken=   generatecsrftoken()
       
        console.log(req.file)


        let formdata = new FormData();

        formdata.append("bucket",  "ai-direct-upload");
        formdata.append("content_type", "image/jpeg" );
        formdata.append("CSRFtoken", CSRFtoken);

        let first_response = await fetch(
            "https://www.befunky.com/api/direct-upload/",
            {
              method: "POST",
              body: formdata,
            }
          );
          let data = await first_response.json();

         

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
            "https://ai-direct-upload.s3-accelerate.amazonaws.com",
            {
              method: "POST",
              body: formData,
            }
          );
      
          let new_data = await second_response.text();

          let parse = new DOMParser();
          let xml_data = parse.parseFromString(new_data, "text/xml");
  
          let location =
            xml_data.getElementsByTagName("Location")[0].textContent;
  
          console.log("Location:", location);

          if ( xml_data && location) {
            // Third Response //
       
  
            let final_formdata = new FormData();
  
            final_formdata.append("method", "api/artsy-generative/");
            final_formdata.append("image", location);
            final_formdata.append(
              "CSRFtoken",
              "0ea7030184120b77ba6590ed724906b9.c1b88547f6be895845ed495d3f75d5eb3d215de34a4e4e15916b6263b399a037"
            );
            final_formdata.append("style", '6');
            final_formdata.append("fidelity", '5');
            final_formdata.append("variation", '1');
            let csrf_token =
              "CSRFtoken=64381e528e7c7a9b9f69f4499d274904.9787bfa35a80724553b7be2700aaf34829b601f4b6a284edc749973b002aabbe";
  
            let urlencoded = new URLSearchParams(final_formdata).toString();
  
            let final_response = await fetch(
              "https://upload.befunky.com/artsy/",
              {
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                  "x-csrf-token":
                    "2c960a074b35ca015d45cc8dd99a6493.60efe4c42fb65433eaf310dd124b435bd96d859f88cfa7693e96694e389a3105",
                  cookie: csrf_token,
                },
  
                body: urlencoded,
                method: "POST",
              }
            );
     
            let { data } = await final_response.json();
    console.log(data)
            console.log(data.image);
            console.log(data.original_img);
            console.log(data.success);
  
            // Third Response //
  
            if (data.success === true) {
              return res.json({
                success: true,
                filtered_image: data.image,
              });
            }
          }


        }
        
      

    }
    catch(error){
        console.log(error.message)
    }
}




}