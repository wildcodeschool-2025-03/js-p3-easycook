import AccueilCategory from "@/components/AccueilCategory";
import HowWorks from "@/components/HowWorks";
import OurSelection from "../../components/OurSelection";
import SearchAccueil from "../../components/SearchAccueil";

function Accueil() {
  return (
    <>
      <SearchAccueil />
      <OurSelection />
      <HowWorks />
      <AccueilCategory />
    </>
  );
}

export default Accueil;
