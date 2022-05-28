import jwt from "jsonwebtoken";
const generateToken = ({ name, email, _id }) => {
  return jwt.sign(
    {
      name,
      email,
      _id,
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "30d",
    }
  );
};
export default generateToken;
