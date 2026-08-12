import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const socketAuth = async (socket, next) => {
  try {
    const cookieHeader =
      socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(
        new Error("Authentication required")
      );
    }

    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((cookie) => {
          const [key, ...value] =
            cookie.trim().split("=");

          return [
            key,
            decodeURIComponent(
              value.join("=")
            ),
          ];
        })
    );

    const token = cookies.accessToken;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decodedToken._id
    ).select("-password -refreshToken");

    if (!user) {
      return next(
        new Error("User not found")
      );
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error(
      "Socket authentication failed:",
      error.message
    );

    next(
      new Error("Authentication failed")
    );
  }
};