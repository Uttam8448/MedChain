const express=require("express");
const expressFileUpload = require("express-fileupload");
const {uploadEHR}  = require("../controllers/EHRControllers");
const { auth, isPatient } = require("../middleware/authMiddleware");


const router=express.Router();
router.use(expressFileUpload());

router.post("/ehr-upload",auth,isPatient,uploadEHR);

module.exports=router;