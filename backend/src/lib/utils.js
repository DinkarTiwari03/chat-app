import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId:userId},process.env.JWT_SECRET,{
        expiresIn: "14d",
    });
    res.cookie("jwt",token,{
        maxAge: 14*24*60*60*1000, // 14 days in milliseconds

        httpOnly: true, // prevent XSS attacks : cross-site scripting attacks

        sameSite: "strict", // to prevent CSRF attacks : cross-site request forgery attacks
        secure: process.env.NODE_ENV === "development"? false: true, // set secure flag in production for HTTPS


    });

    return token; // return the generated token to be used in the response body if needed

};

//http://localhost
//https://myapp.com //secure