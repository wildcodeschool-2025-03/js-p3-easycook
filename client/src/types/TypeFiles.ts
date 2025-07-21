export interface TypeRecipe {
  numberPersons?: number;
  id: number;
  name: string;
  time_preparation?: number;
  description?: string;
  difficulty?: string;
  picture?: string;
  step1?: string;
  step2?: string;
  step3?: string;
  step4?: string;
  step5?: string;
  step6?: string;
  step7?: string;
  kcal?: number;
  recipe_name?: string;
  rate: number;
  diet_name?: string;
  id_category?: number;
  id_diet?: number;
}

export interface TypeDiet {
  id: number;
  name: string;
  "Sans Gluten": boolean;
}

export interface TypeCategory {
  id: number;
  name: string;
}

export interface TypeUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

export interface TypeIngredient {
  numberPersons: number;
  ingredient_id: number;
  unit_name: string;
  ingredient_picture: string;
  ingredient_quantity: number;
  ingredient_name: string;
  id: number;
  name: string;
  picture: string;
}

export interface TypeUnity {
  id: number;
  value?: number;
  name: string;
  unity_id?: number;
}

export interface TypeAction {
  rate: number;
  is_favorite: boolean;
  comment: string;
}

export interface TypeUstensil {
  ustensil_picture: string;
  ustensil_id: number;
  ustensil_name: string;
  id: number;
  name: string;
  recipeUstensil(id: number): Promise<TypeUstensil[]>;
  addUstensils(recipeId: number, ustensilIds: number[]): Promise<void>;
}

export interface TypeList {
  id: number;
  user_id: number;
}

export interface TypeForm {
  name: string;
  lastname: string;
  email: string;
  message: string;
}

export interface TypeRandom {
  id: number;
  picture: string;
  name: string;
  time_preparation: number;
  rate: number;
}

export interface newMember {
  name: string;
  email: string;
  user_id: number;
  password: string;
}

export interface Member {
  name: string;
  email: string;
  id: number;
  admin: boolean;
  password: string;
  inscription?: string;
}

export interface Recipe {
  id: number;
  name: string;
}

export interface ingredientDetails {
  id: number;
  quantity: number;
  unity: number;
  unity_id: number;
}

export type FormData = {
  name: string;
  description: string;
  time_preparation: string;
  difficulty: string;
  kcal: string;
  id_category: string;
  id_diet: string;
  step1?: string;
  step2?: string;
  step3?: string;
  step4?: string;
  step5?: string;
  step6?: string;
  step7?: string;
};

export type SelectedIngredient = {
  id: number;
  quantity: string;
  unity_id: number;
  value: string;
};
