import type { RequestHandler } from "express";

import unityRepository from "./unityRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const unity = await unityRepository.readAll();

    res.json(unity);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
};
