

module.exports = {
  remove_bg: async (req, res) => {
    try {
      console.log(req.file);

      const imagefile = new Blob([req.file.buffer], {
        type: req.file.mimetype,
      });
      console.log("image", imagefile);
      let form = new FormData();
      form.append("image_file",imagefile,req.file.originalname);
      // console.log(form);

      let bg_response = await fetch(
        "https://clipdrop-api.co/remove-background/v1",
        {
          method: "POST",
          headers: {
            "x-api-key":
              "c5383ef3b3bed4022338890cfbda128cf480e3888e7d795f3e83bf57caea73d2b55b3dc299bdf71845d49755dbca47c8",
          },
          body: form,
        }
      );
  console.log(bg_response)
      if (bg_response.statusText === 'OK') {
        let data = await bg_response.arrayBuffer();
      
        res.json({ data });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
};
