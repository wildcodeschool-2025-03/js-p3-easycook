import { useUser } from "@/context/UserContext";
import { Link, useLocation } from "react-router";

function Footer() {
  const location = useLocation();
  const { isEasterEgg, setIsEasterEgg } = useUser();
  function handleEggs() {
    if (location.pathname === "/Mixer") {
      document.body.style.cursor = 'url("/pointer-bonjour.png"), auto';
      if (!isEasterEgg) {
        setIsEasterEgg(true);
      }
    }
  }
  return (
    <>
      <section className="border-t-2 border-primary flex flex-col md:flex-row justify-between items-center md:items-start px-4 md:px-8 xl:px-16">
        <div className="order-1 md:order-2 flex justify-center py-4 w-full md:w-1/3">
          <img
            onDoubleClick={() => handleEggs()}
            className="max-w-[30%] md:max-w-[30%] xl:max-w-[30%]"
            src="/cook-bonjour.png"
            alt="bonjour"
          />
        </div>
        <div className="order-2 md:order-3 flex flex-col items-center md:items-end lg:py-10 md:py-8 xl:py-10 w-full md:w-1/3 text-base md:text-lg xl:text-xl">
          <Link to="/Contact" className=" font-bold text-secondary">
            Contact
          </Link>

          <Link to="/Mentions_legales" className=" font-bold text-secondary">
            Mentions légales
          </Link>
        </div>
        <div className="order-3 md:order-1 flex justify-center md:justify-start gap-2 py-4 lg:py-10 md:py-8 xl:py-10 w-full md:w-1/3">
          <a href="https://www.facebook.com/">
            <i className="text-3xl md:text-4xl xl:text-5xl bi bi-facebook text-secondary" />
          </a>
          <a href="https://www.instagram.com/">
            <i className="text-3xl md:text-4xl xl:text-5xl bi bi-instagram text-secondary" />
          </a>
          <a href="https://fr.pinterest.com/">
            <i className="text-3xl md:text-4xl xl:text-5xl bi bi-pinterest text-secondary" />
          </a>
        </div>
      </section>
      <p className="text-center font-bold py-2 text-sm md:text-base xl:text-lg">
        <i className="bi bi-c-circle" /> Easy Cook
      </p>
    </>
  );
}

export default Footer;
