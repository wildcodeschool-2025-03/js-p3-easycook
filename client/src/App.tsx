import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTopButton from "./components/scroll/scroll_top";
import { UserProvider } from "./context/UserContext";

import "./App.css";

function App() {
  return (
    <UserProvider>
      <Toaster richColors position="top-center" />
      <Header />
      <Banner />
      <Outlet />
      <Footer />
      <ScrollToTopButton />
    </UserProvider>
  );
}

export default App;
