import type { RequestHandler } from "express";

import dietRepository from "./dietRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const diet = await dietRepository.readAll();

    res.json(diet);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
};
