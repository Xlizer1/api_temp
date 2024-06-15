const express = require("express");
const router = express.Router();
const UserImageController = require("./UserImageController");
const multer = require("../../helper/multer");

router.get("/",(req,res)=>{
  UserImageController.getUserImages(req,response=>{
    res.json(response)
  })
});
router.get("/list",(req,res)=>{
  UserImageController.getUserImagesList(req,response=>{
    res.json(response)
  })
});
router.post("/",multer.upload.single("file"),(req,res)=>{
  UserImageController.createUserImage(req,response=>{
      res.json(response)
    })
});
router.put("/:user_image_id",(req,res)=>{
    UserImageController.updateUserImage(req,response=>{
      res.json(response)
    })
});
router.delete("/:user_image_id",(req,res)=>{
    UserImageController.deletedUserImage(req,response=>{
      res.json(response)
    })
});


module.exports = router;
