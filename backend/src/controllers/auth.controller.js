import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";

// for hashing the password we installed the package bcryptjs
import bcrypt from "bcryptjs";

export const signup = async(req, res) => {
    const {fullName, email,password} = req.body;

    try{
            if(!fullName || !email || !password){
                return res.status(400).json({message:"All fields are required"});
            }

            if(password.length < 6){
                return res.status(400).json({message:"Password must be at least 6 characters long"});
            }

            //check if email if valid

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(email)){
                return res.status(400).json({message: "Invalid email format"})
            }

            const user  = await User.findOne({email});

            if(user){
                return res.status(400).json({message:"Email already exists"});
            }

            // user password hashing

            const salt = await bcrypt.genSalt(10);  // 10 is the length of hashing it can be 20,100 etc
            const hashedPassword = await bcrypt.hash(password, salt); // hashing the password with the salt

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword, // storing the hashed password in the database
            });

            if(newUser){

                //this generateToken function is used to generate a token for the user and send it in the response header
                // it is in lib folder in util.js file
                generateToken(newUser._id, res);
                await newUser.save();

                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                });
            
            }

            // TO:Do = send a welcome email to the user after successfull signup ;

            
            else{
                res.status(400).json({message:"Invalid user data"});
            }
 



    }
    catch(error){

        console.log("Error in signup controller:",error);
        res.status(500).json({message:"Internal server error"});

    }

};