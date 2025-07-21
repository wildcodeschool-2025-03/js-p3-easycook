import NavBar_Logo from "./NavBar/NavBar_Logo";
import NavBar_Mobile from "./NavBar/NavBar_Mobile";
import NavBar_UL from "./NavBar/NavBar_UL";

function Header() {
  return (
    <header className="lg:w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:mr-25">
        <div className="lg:flex lg:justify-between">
          <NavBar_Logo />
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <NavBar_UL />
        </div>

        <div className="md:hidden">
          <NavBar_Mobile />
        </div>
      </div>
    </header>
  );
}

export default Header;
