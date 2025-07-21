import type { RequestHandler } from "express";
import type { TypeUstensil } from "../../../../client/src/types/TypeFiles";

// Import access to data
import ustensilRepository from "./ustensilRepository";

const recipeUstensil: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const recipiesId = Number(req.params.id);
    const recipe = await ustensilRepository.recipeUstensil(recipiesId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (recipe == null) {
      res.sendStatus(404);
    } else {
      res.json(recipe);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const addUstensils: RequestHandler = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);
    const ustensilIds = req.body.ustensils || [];

    if (Number.isNaN(recipeId)) {
      res.status(400).json({ error: "ID de recette invalide" });
      return;
    }

    await ustensilRepository.addUstensils(recipeId, ustensilIds);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur lors de l’ajout des ustensiles à la recette :", err);
    next(err);
  }
};

const getAllUstensils: RequestHandler = async (req, res, next) => {
  try {
    const ustensils = await ustensilRepository.getAllUstensils();
    res.status(200).json(ustensils);
  } catch (err) {
    console.error("Erreur lors de la récupération des ustensiles :", err);
    next(err);
  }
};

export default { recipeUstensil, addUstensils, getAllUstensils };
