require("dotenv").config();
const { DOMParser } = require("xmldom");
const crypto = require("crypto");
const Jimp =require("jimp")
const { response } = require("express");
const axios =require("axios")

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

          let base64String = req.file.buffer.toString('base64')
        
          let req_body = {base64:`data:image/jpeg;base64,${base64String}`}
        
          amount='50%';
          let final_response = await fetch(`https://api2.cartoonize.net/api/effects/fxcartoon/1?level=${amount}socketId=p3eA-rwtNJOJewE0ADAW?`,{
            method:"POST",
            headers:{
              'Content-Type':"application/json"
            },
            body:JSON.stringify(req_body),
           
          })
          let {base64} = await final_response.json()

         
 
          if (base64) {
            return res.json({
              success: true,
              filtered_image: base64,
            });
          
          }
         
        // }
      // }
    } catch (error) {
      console.log("buffer error",error.message);
    }
  },


}
  
