import { useState } from "react";
import { useNavigate } from "react-router";

function SearchAccueil() {
  const [searchWord, setSearchWord] = useState("");
  const navigate = useNavigate();

  const HandleSetLocalStorage = (word: string) => {
    localStorage.setItem("searchWord", word);
    navigate("/Recettes");
  };

  return (
    <section className="flex flex-col absolute top-20 md:top-30 left-1/2 transform -translate-x-1/2 z-1 text-white items-center justify-center">
      <article className="relative z-10 lg:flex  text-3xl md:text-4xl lg:text-6xl md:font-semibold font-bold text-white text-center drop-shadow-lg mb-2 animate-fade-in mb-5">
        On mange quoi
        <br />
        cette semaine&nbsp;?
      </article>

      <article className="flex items-center bg-white/95 border-2 border-primary/50 rounded-full shadow-lg px-4 py-2 gap-2">
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Recette, ingrédient..."
          className="bg-transparent text-secondary placeholder:text-secondary/60 rounded-full px-4 py-2 border-none outline-none focus:ring-2 focus:ring-primary text-sm lg:text-lg min-w-60 lg:min-w-96 transition-all duration-200"
          type="text"
        />
        <button
          onClick={() => HandleSetLocalStorage(searchWord)}
          type="button"
          className="bg-primary hover:bg-primary/90 transition-colors duration-200 h-10 w-15 md:h-15 md:w-25 flex items-center justify-center rounded-full shadow-md border-2 border-secondary focus:ring-2 focus:ring-primary"
          aria-label="Rechercher"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <title>Search</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </button>
      </article>
    </section>
  );
}

export default SearchAccueil;
