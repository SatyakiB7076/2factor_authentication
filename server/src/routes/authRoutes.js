import {Router} from "express";
import passport from "passport";
import {register,reset2FA,verify2FA,login,logout,setup2FA,authStatus} from "../controllers/authController.js"

const router=Router();

//registration Route
router.post("/register",register);
//Login Route
router.post("/login",passport.authenticate("local"),login);
//Auth Status Route
router.get("/status",authStatus);
//Logout Route
router.post("/logout",logout);


//2fa setup is for authorized users only so adding middleware here 
router.post("/2fa/setup",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorized user"})
},setup2FA);


//2fa verify
router.post("/2fa/verify",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorized user"})
},verify2FA);


//reset
router.post("/2fa/reset",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"Unauthorized user"})
},reset2FA);
export default router;