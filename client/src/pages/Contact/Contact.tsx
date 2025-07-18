import Contact_Form from "./Contact_Form";

function Contact() {
  return (
    <article className="mx-5">
      <h1 className="text-center p-10">Contactez-nous</h1>
      <div className="mx-5 lg:mx-50 xl:mx-150">
        <h3 className="text-secondary font-bold">
          Une question, une suggestion, un petit mot sympa ? n'hésitez pas à
          nous écrire !
        </h3>
        <p className="text-justify">
          Que ce soit pour un retour sur le site, une demande d’assistance, ou
          même pour proposer votre propre recette, nous serons ravis de vous
          lire. L’équipe EasyCook est à votre écoute — parce que ce projet,
          c’est aussi un peu le vôtre.
        </p>
      </div>

      <Contact_Form />
    </article>
  );
}

export default Contact;
