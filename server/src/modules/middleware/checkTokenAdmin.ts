import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JWTPayload {
  AdminId: number;
}

const checkTokenAdmin: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization;
  const idToDelete = req.query.idToDelete;
  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const { AdminId } = decoded as JWTPayload;

    req.userId = AdminId;
    next();
  });
};

export default { checkTokenAdmin };
