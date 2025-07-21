import type { RequestHandler } from "express";

import categoryRepository from "./categoryRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const categories = await categoryRepository.readAll();

    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
};
