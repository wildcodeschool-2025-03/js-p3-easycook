import type { RequestHandler } from "express";
import listRepository from "./listRepository";

const addList: RequestHandler = async (req, res, next) => {
  try {
    // Extract user ID from the request parameters
    const userId = Number(req.params.id);
    // Extract the list from the request body
    const { list } = req.body;

    // Validate that the list is an array
    if (!Array.isArray(list)) {
      res.status(401).json({ error: "Invalid list format" });
      return;
    }

    // Add the list to the database
    const addedList = await listRepository.addList(userId);
    const addListRecipe = await listRepository.addListRecipe(addedList, list);
    // Respond with the added list in JSON format
    res.status(201).json(addedList);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { addList };
