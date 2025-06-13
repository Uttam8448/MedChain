
const express = require("express");
const router = express.Router();
const { signUp, generateNonce, logIn, accessGranted } = require("../controllers/authControllers");
const {verifyNonce, isPatient,auth, isDoctor} = require("../middleware/authMiddleware");
const { getDoctor } = require("../controllers/authControllers");
const { provideAccess,revokeAccess,accessPatient } = require("../controllers/authControllers");

// router.get("/signup", )
router.post('/generate-nonce',generateNonce);
// router.post('/verify-nonce',verifyNonce);
router.post('/sign-up',verifyNonce,signUp);

router.post('/log-in',verifyNonce,logIn);

router.get('/get-doctors',auth,isPatient,getDoctor);

router.post('/provide-access',auth,isPatient,provideAccess);

router.get('/access-granted',auth,isPatient,accessGranted);

router.post('/revoke-access',auth,isPatient,revokeAccess);

router.get('/get-patients',auth,isDoctor,accessPatient);


module.exports = router;