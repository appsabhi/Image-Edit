require("dotenv").config();







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
            body:JSON.stringify(req_body)
           
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
      return res.json({error:error.message})
    }
  },


}
  
