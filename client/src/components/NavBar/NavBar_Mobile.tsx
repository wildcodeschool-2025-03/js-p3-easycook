import { useUser } from "@/context/UserContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import useToggle from "@/hooks/useToggle";
import { useRef } from "react";
import { Link } from "react-router";

function NavBar_Mobile() {
  const { isConnected } = useUser();
  const { toggleMenu, isOpen, setIsOpen } = useToggle();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setIsOpen(false);
  useClickOutside(menuRef, closeMenu);

  return (
    <div aria-expanded={isOpen} ref={menuRef}>
      <section className="absolute top-5 right-5 ">
        <button
          type="button"
          className={`flex flex-col justify-between w-8 h-6 ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span
            className={`block h-1 w-full rounded transition-transform duration-300  ${
              isOpen
                ? "bg-primary transform rotate-45 translate-y-2.5 "
                : "bg-secondary"
            }`}
          />
          <span
            className={`block h-1 w-full rounded transition-opacity  ${
              isOpen ? "opacity-0" : "bg-secondary"
            }`}
          />
          <span
            className={`block h-1 w-full rounded transition-transform duration-300 ${
              isOpen
                ? "bg-primary transform -rotate-45 -translate-y-2.5"
                : "bg-secondary"
            }`}
          />
        </button>
      </section>

      {isOpen && (
        <div className=" absolute w-[40%] right-0 shadow-2xl pt-2 bg-[#fde9cc] rounded-bl-2xl z-3">
          <div className="font-semibold pb-4 text-right ">
            <Link
              to="/Recettes"
              className=" mr-8 mt-2 block text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Recettes
            </Link>

            <span className="block border-t border-[#dd682d] my-3" />

            <Link
              to="/Courses"
              className=" mr-8 mt-2 block text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Mes courses
            </Link>

            <span className="block border-t border-[#dd682d] my-3" />

            <Link
              to="/A_propos"
              className=" mr-8 mt-2 block text-secondary"
              onClick={() => setIsOpen(false)}
            >
              A propos
            </Link>

            <span className="block border-t border-[#dd682d] my-3" />

            <Link
              to="/Mixer"
              className=" mr-8 mt-2 block text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Mixer
            </Link>

            <span className="block border-t border-[#dd682d] my-3" />
            {/* Refactoriser */}
            {!isConnected ? (
              <Link
                to="/Compte"
                className="mr-8 mt-2 block text-secondary"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
            ) : (
              <Link
                to="/Compte"
                className="mr-8 mt-2 block text-secondary"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Mon Compte
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar_Mobile;
