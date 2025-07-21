import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Define the shape of your JWT payload
interface JWTPayload {
  id: number;
}

const checkToken: RequestHandler = (req, res, next) => {
  //variable token qui est une requete du headers et controle le token coté client.
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      // console.error("Token verification failed:", err);
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    // On extrait l'ID utilisateur (decoded.id) et on le stocke dans la requête (req.userId) pour un usage ultérieur
    const { id } = decoded as JWTPayload;
    req.userId = id;
    next();
  });
};

export default { checkToken };
