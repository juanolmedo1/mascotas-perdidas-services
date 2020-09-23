import { User } from "@src/entity/User";
import { sign, verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "@src/MyContext";
import { AuthenticationError } from "apollo-server-core";
import { ErrorMessages } from "@src/types/ErrorMessages";

const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers.authorization;
  if (!authorization) {
    throw new AuthenticationError(ErrorMessages.USER_NOT_AUTHENTICATED);
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (error, decoded) => {
        if (error) {
          console.log(error);
        } else {
          console.log(decoded);
        }
      }
    );
    context.payload = payload as any;
  } catch (err) {
    throw new AuthenticationError(ErrorMessages.USER_NOT_AUTHENTICATED);
  }

  return next();
};

const createAccessToken = (user: User) => {
  const { id } = user;
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "9999y",
  });
};

export default { isAuth, createAccessToken, createRefreshToken };
