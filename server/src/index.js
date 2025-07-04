import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js"

dotenv.config();
dbConnect();
const app = express();

//middlewares
const corsOption={
    origin:"http://localhost:3001",
    credentials: true,
}
app.use(json({limit:"100mb"}));
app.use(urlencoded({limit:"100mb",extended:true}));
app.use(cors(corsOption));
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60000 * 60
    }
}))
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/auth",authRoutes)
//listen app
const port =process.env.PORT || 7002;
app.listen(port,()=>{
    console.log(`Server is listening to port ${port}`);
    
})