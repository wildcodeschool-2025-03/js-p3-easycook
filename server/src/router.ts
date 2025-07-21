import express from "express";
import security from "./modules/middleware/checkToken";
import securityAdmin from "./modules/middleware/checkTokenAdmin";
const router = express.Router();
import categoryActions from "./modules/category/categoryActions";
import dietActions from "./modules/diet/dietActions";
import ingredientActions from "./modules/ingredient/ingredientActions";
import listActions from "./modules/list/listActions";
import recipeActions from "./modules/recipe/recipeActions";
import unityActions from "./modules/unity/unityActions";
import memberActions from "./modules/user/memberActions";
import ustensilActions from "./modules/ustensil/ustensilActions";

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */
// Mur Middleware Securité-------------------------
router.use("/api/member", security.checkToken); // middleware pour les routes membres
router.use("/api/admin", securityAdmin.checkTokenAdmin); // middleware pour les routes admin

//Public Actions
router.get("/api/unity", unityActions.browse);
router.get("/api/diet", dietActions.browse);
router.get("/api/category", categoryActions.browse);
router.get("/api/recipe/random", recipeActions.random);
router.get("/api/recipe", recipeActions.browse);
router.get("/api/recipe/detail/:id", recipeActions.read);
router.get("/api/recipe/search/:id", recipeActions.search);
router.get("/api/recipe/category/:id", recipeActions.category);
router.get("/api/recipe/diet/:id", recipeActions.diet);
router.get("/api/recipe/time/:id", recipeActions.time);
router.get("/api/recipe/difficulty/:id", recipeActions.difficulty);
router.get("/api/accueil/category", recipeActions.accueilCategory);

//ingredient + ustencils + rate

router.get("/api/ingredient", ingredientActions.browse);
router.get("/api/ingredients", ingredientActions.browse);
router.get("/api/ingredients/by-type", ingredientActions.browseWithType);
router.get("/api/recipe/by-ingredients", recipeActions.byIngredients);
router.get("/api/ingredient/recipe/:id", ingredientActions.recipeIngredient); //tout les ingrediends, quantité et unite pour une recette(id)
router.get("/api/ustensil/recipe/:id", ustensilActions.recipeUstensil); //tout les ustensiles pour une recette(id)
router.get("/api/ustensil", ustensilActions.getAllUstensils);
router.get("/api/rate/recipe/:id", recipeActions.rate); //pour afficher la note et les commentaires d'une recette

//Authentification

router.post("/api/signup", memberActions.add, memberActions.login); // le "Add" permet de rajouter le compte et l'action "login" de ce log directement avec un token.
router.post("/api/login", memberActions.login); //l'action "login" permet de ce log directement avec un token si membre existant.
//Zone Membre ----------------------
router.patch("/api/member", memberActions.editMember); // modification du profile membre
router.get("/api/member/:id/profile", memberActions.readMemberProfile); // pour afficher le profile d'un membre
router.get("/api/member/:id/favorite", memberActions.readFavorite); // liste des recettes favorites d'un membre
router.get("/api/member/:id/comments", memberActions.readCommented); //pour afficher les commentaires d'une recette
router.get("/api/member/:id/registeredlist", memberActions.readRegisteredList);
router.post("/api/member/:id/list", listActions.addList); //ajouter une liste de courses
router.delete("/api/member/:id", memberActions.deleteAccount); //supression compte
router.get("/api/member", memberActions.checkId); // token Check
router.get("/api/member/:id", memberActions.readFavorite); // liste des recettes favorites d'un membre
router.post("/api/member/rate/recipe", recipeActions.addRate); //pour ajouter une note sur une recette
router.post("/api/member/comment/recipe", recipeActions.addComment); //pour ajouter un commentaire sur une recette
router.post("/api/member/favorite/recipe", recipeActions.updateFavorite); //pour ajouter une recette aux favoris")

//Zone Admin ----------------------

router.get("/api/admin/member", memberActions.browse);
router.get("/api/admin/recipes", recipeActions.listRecipesAdmin);
router.delete("/api/admin/:id", memberActions.deleteMemberAsAdmin);
router.patch("/api/admin/recipe/:id", recipeActions.update);
router.patch("/api/admin/:id", memberActions.UpdateAdminStatus); // Change le status d'un membre en (admin:true ou admin:false)
router.post("/api/admin/recipe", recipeActions.add); //TODO check for issue linked to Ustensil

/* ************************************************************************* */

// Define list-related routes

export default router;
