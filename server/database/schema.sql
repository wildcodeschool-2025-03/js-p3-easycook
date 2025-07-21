-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.action (
  user_id integer NOT NULL,
  recipe_id integer NOT NULL,
  rate integer,
  is_favorite boolean,
  comment text,
  CONSTRAINT action_pkey PRIMARY KEY (user_id, recipe_id),
  CONSTRAINT favorite_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe(id),
  CONSTRAINT favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.category (
  name character varying NOT NULL,
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.diet (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  name character varying NOT NULL,
  Sans Gluten boolean,
  CONSTRAINT diet_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ingredient (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  picture character varying,
  id_type_ingredient integer,
  CONSTRAINT ingredient_pkey PRIMARY KEY (id),
  CONSTRAINT ingredient_id_type_ingredient_fkey FOREIGN KEY (id_type_ingredient) REFERENCES public.type_ingredient(id)
);
CREATE TABLE public.list (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id integer NOT NULL,
  date_creation date NOT NULL DEFAULT now(),
  CONSTRAINT list_pkey PRIMARY KEY (id),
  CONSTRAINT list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id)
);
CREATE TABLE public.list_recipe (
  list_id integer NOT NULL,
  recipe_id integer NOT NULL,
  number_people integer NOT NULL,
  CONSTRAINT list_recipe_pkey PRIMARY KEY (list_id, recipe_id),
  CONSTRAINT list_recipe_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.list(id),
  CONSTRAINT list_recipe_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe(id)
);
CREATE TABLE public.member (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password text NOT NULL CHECK (length(password) <= 100),
  admin boolean DEFAULT false,
  inscription date DEFAULT now(),
  CONSTRAINT member_pkey PRIMARY KEY (id)
);
CREATE TABLE public.recip_ingredient (
  quantity integer NOT NULL,
  ingredient_id integer NOT NULL,
  recipe_id integer NOT NULL,
  unity_id integer NOT NULL,
  CONSTRAINT recip_ingredient_pkey PRIMARY KEY (ingredient_id, recipe_id, unity_id),
  CONSTRAINT recip_ingredient_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe(id),
  CONSTRAINT recip_ingredient_unity_id_fkey FOREIGN KEY (unity_id) REFERENCES public.unity(id),
  CONSTRAINT recip_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(id)
);
CREATE TABLE public.recipe (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  name text UNIQUE,
  time_preparation integer,
  description character varying,
  difficulty character varying,
  step1 text,
  picture character varying,
  kcal integer,
  id_category integer,
  id_diet integer,
  date_creation date,
  step2 text,
  step3 text,
  step4 text,
  step5 text,
  step6 text,
  step7 text,
  CONSTRAINT recipe_pkey PRIMARY KEY (id),
  CONSTRAINT recipe_id_category_fkey FOREIGN KEY (id_category) REFERENCES public.category(id),
  CONSTRAINT recipe_id_diet_fkey FOREIGN KEY (id_diet) REFERENCES public.diet(id)
);
CREATE TABLE public.recipe_utensil (
  recipe_id integer NOT NULL,
  utensil_id integer NOT NULL,
  CONSTRAINT recipe_utensil_pkey PRIMARY KEY (recipe_id, utensil_id),
  CONSTRAINT recipe_utensil_utensil_id_fkey FOREIGN KEY (utensil_id) REFERENCES public.utensil(id),
  CONSTRAINT recipe_utensil_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe(id)
);
CREATE TABLE public.type_ingredient (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  name text NOT NULL,
  CONSTRAINT type_ingredient_pkey PRIMARY KEY (id)
);
CREATE TABLE public.unity (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  value character varying NOT NULL,
  CONSTRAINT unity_pkey PRIMARY KEY (id)
);
CREATE TABLE public.utensil (
  name character varying NOT NULL,
  picture character varying,
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  CONSTRAINT utensil_pkey PRIMARY KEY (id)
);