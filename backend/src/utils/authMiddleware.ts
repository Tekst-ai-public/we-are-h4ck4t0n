import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import prisma from "./prisma";
import FacebookClient from "./facebookClient";

export function authMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.jwt
      if (!token) {
        return res.status(403).json("unauthorized")
      }
      const decoded = jwt.verify(token, "SECRET")
      const uid = decoded.id

      const user = await prisma.authUser.findFirstOrThrow({
        where: {
          id: uid
        }
      })

      const fb = new FacebookClient(user.token)
      req.fb = fb
      req.userId = uid
      next()
    } catch (err) {
      console.error(err)
      return res.status(403).json("unauthorized")
    }
  }
}
