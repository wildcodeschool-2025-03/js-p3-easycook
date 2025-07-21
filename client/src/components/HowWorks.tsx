// Composant modernisé : section "Comment ça marche ?" enrichie avec plus d'infos
import { useNavigate } from "react-router";

function HowWorks() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-140 bg-gradient-to-br from-primary/10 to-secondary/10 mx-4 md:mx-9 rounded-4xl shadow-2xl border-4 border-white/20 overflow-hidden my-12 animate-fade-in">
      {/* Décor de fond subtil */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />
      <article className="flex flex-col items-center justify-center gap-2 py-8 px-4">
        {/* Sous-titre d'accroche */}

        <header className="flex flex-col items-center mb-8">
          <h2 className="mb-3 text-3xl md:text-4xl font-extrabold text-primary drop-shadow">
            Comment ça marche ?
          </h2>

          <div className="flex justify-center">
            <img
              className="h-20 w-20 animate-bounce-slow"
              src="/cook-reflexion.png"
              alt="logo qui réfléchit"
            />
          </div>
          <p className="text-lg md:text-xl text-secondary/80 font-medium text-center max-w-2xl">
            Easy Cook simplifie vos repas au quotidien : trouvez, filtrez,
            sauvegardez votre liste de courses, cuisinez !
          </p>
        </header>
        {/* Les étapes sous forme de cartes */}
        <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-5xl">
          {/* Carte 1 */}
          <div className="flex-1 bg-white/90 rounded-3xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl animate-fade-in-up">
            <img
              className="mx-auto h-16 w-16 mb-2"
              src="/rechercher.png"
              alt="loupe"
            />
            <h3 className="text-xl font-semibold text-primary mb-1">
              Rechercher des recettes
            </h3>
            <p className="text-center text-secondary/80">
              Trouvez facilement des recettes selon vos ingrédients, type de
              plat ou mots-clés et choisissez ce qui vous plaît.
            </p>
          </div>
          {/* Carte 2 */}
          <div className="flex-1 bg-white/90 rounded-3xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-100">
            <img
              className="mx-auto h-16 w-16 mb-2"
              src="/filtrer.png"
              alt="filtre"
            />
            <h3 className="text-xl font-semibold text-primary mb-1">
              Filtrez selon vos besoins
            </h3>
            <p className="text-center text-secondary/80">
              Affinez votre recherche avec des filtres et découvrez des recettes
              adaptées à votre mode de vie.
            </p>
          </div>
          {/* Carte 3 */}
          <div className="flex-1 bg-white/90 rounded-3xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-200">
            <img
              className="mx-auto h-16 w-16 mb-2"
              src="/coeur.png"
              alt="coeur"
            />
            <h3 className="text-xl font-semibold text-primary mb-1">
              Sauvegardez vos favoris
            </h3>
            <p className="text-center text-secondary/80">
              Enregistrez vos recettes préférées et créez automatiquement votre
              liste de courses pour une préparation de repas simplifiée.
            </p>
          </div>
        </div>
        {/* Chiffres clés */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 mb-4 w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              +50
            </span>
            <span className="text-secondary/70 text-sm md:text-base">
              Recettes disponibles
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              200+
            </span>
            <span className="text-secondary/70 text-sm md:text-base">
              Membres actifs
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              4.8/5
            </span>
            <span className="text-secondary/70 text-sm md:text-base">
              Note moyenne
            </span>
          </div>
        </div>
        {/* Mini-témoignage */}
        <div className="mt-2 max-w-xl mx-auto bg-white/80 rounded-2xl shadow p-4 flex flex-col items-center animate-fade-in-up delay-300">
          <span className="italic text-secondary/80 text-center">
            “Grâce à Easy!Cook, je trouve des idées de repas en 2 minutes et je
            gagne du temps chaque semaine !”
          </span>
          <span className="mt-2 text-primary font-semibold">
            — Julie, membre depuis 2023
          </span>
        </div>
        {/* Bouton d'action */}
        <button
          type="button"
          onClick={() => navigate("/Recettes")}
          className="mt-2 px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200 focus:ring-2 focus:ring-secondary focus:outline-none animate-fade-in-up"
        >
          Découvrir les recettes
        </button>
      </article>
    </section>
  );
}

export default HowWorks;
