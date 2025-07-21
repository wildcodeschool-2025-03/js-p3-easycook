function About() {
  return (
    <>
      <section className="px-6 md:mx-30 lg:mx-50 xl:mx-120">
        <h1 className="font-bold text-2xl text-center mt-10 pb-5">
          EasyCook, c’est quoi ?
        </h1>
        <h2 className="text-secondary text-lg pt-5 pb-2">
          Votre assistant cuisine
        </h2>
        <p className="pb-5 text-justify">
          Notre plateforme vous permet de découvrir des recettes simples,
          variées et savoureuses, adaptées à tous les goûts et à tous les
          niveaux. Vous pouvez sélectionner vos plats préférés pour la semaine
          et générer automatiquement une liste de courses organisée, claire et
          complète. Finies les galères du "qu’est-ce qu’on mange ce soir ?" ou
          les oublis au supermarché ! <br />
          Chez EasyCook, nous voulons simplifier la vie en cuisine. Notre
          mission est d’aider chacun à planifier ses repas facilement, à gagner
          du temps, à mieux s’organiser, et à manger de façon plus saine et
          équilibrée, sans stress ni prise de tête. Nous mettons la technologie
          au service du goût et de la praticité.
        </p>
        <h2 className="text-secondary text-lg pt-5 pb-2">Notre vision</h2>
        <p className="pb-10 text-justify">
          Nous croyons profondément que cuisiner doit rester un plaisir, et non
          une contrainte. Dans un monde où le rythme de vie s’accélère, où les
          choix alimentaires se multiplient, et où l'organisation du quotidien
          peut devenir un casse-tête, EasyCook veut offrir une nouvelle manière
          d’aborder la cuisine. Notre vision est de réconcilier praticité et
          créativité culinaire. Nous voulons que chacun, quelle que soit sa
          situation — parent débordé, étudiant, jeune actif ou amateur de
          cuisine — puisse préparer des repas variés, équilibrés et savoureux
          sans perdre du temps à chercher des idées ou à faire des listes
          interminables. EasyCook ambitionne de devenir le compagnon numérique
          de toutes les cuisines : un outil intelligent qui anticipe vos
          besoins, s’adapte à vos envies, et vous aide à mieux consommer, en
          réduisant le gaspillage et en facilitant l'organisation des courses.
          En créant un lien direct entre l’inspiration (les recettes) et
          l’action (la liste de courses), nous participons à une alimentation
          plus consciente, plus joyeuse, et plus durable.
        </p>
        <img
          className="md:hidden flex items-center rounded-md w-96 mb-10"
          src="./about.jpg"
          alt="about"
        />
        <div className="hidden md:flex justify-center mb-10">
          <img className="rounded-md w-350" src="./aboutok.png" alt="about" />
        </div>
      </section>
    </>
  );
}

export default About;
