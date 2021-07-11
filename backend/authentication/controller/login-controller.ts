import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import registerUser from "../../user/schema/user-schema";
import { message } from "../../utils/success-response";

const LoginController = (request: any, response: any) => {
  const { email, phone, password } = request.body;
  registerUser.findOne(
    {
      $and: [
        { $or: [{ email: email.toLowerCase() }, { phone: phone }] },
        { approval: process.env.APPROVED },
      ],
    },
    (error: any, result: any) => {
      if (error) {
        response.json(
          message(
            "Error Happened while registering User, Try Again !",
            null,
            false
          )
        );
      } else if (!result) {
        response.json(
          message("User is not registered / Activated ", null, false)
        );
      } else if (bcrypt.compareSync(password, result.password)) {
        console.log("JWT Token Created");
        console.log(result);
        const key = process.env.JWT_SECRET as Secret;
        try {
          jwt.sign(
            { auth: true, name: result.name, id: result.id, role: result.role },
            key,
            (error: any, token: any) => {
              if (error) {
                response.json(message("Login Error", error, false));
              } else {
                response.json(message("Login Success", token, true));
                console.log(token);
              }
            }
          );
        } catch {
          response.json(message("Authentication Error", null, false));
        }
      } else if (!bcrypt.compareSync(password, result.password)) {
        response.json(message("Wrong Username/Password", null, false));
      } else {
        response.json(
          message(
            "Error Happened while registering User, Try Again !",
            null,
            false
          )
        );
      }
    }
  );
};

export default LoginController;
