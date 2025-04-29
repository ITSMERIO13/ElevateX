import jwt from "jsonwebtoken";

const generateTokenandSetcookie = (userId, res) => {
  const token = jwt.sign({ userId },'process.env.JWT_SERECT_KEY', {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, //prevent xss attacks cross-site js 
    sameSite:"strict",
    secure: process.env.NODE_ENV !== "development",
  });
};


export default generateTokenandSetcookie;  //export the function to use in other files