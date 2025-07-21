// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

/* ************************************************************************* */

// Import the main app component
import App from "./App";
import About from "./pages/About/About.tsx";
import Account from "./pages/Account/Account.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import Contact from "./pages/Contact/Contact.tsx";
// Import additional components for new routes
import Home from "./pages/Home/Home.tsx";
import List from "./pages/List_Course/List.tsx";
import Mentions from "./pages/Mentions/Mentions.tsx";
import Mixer from "./pages/Mixer/Mixer.tsx";
import NotFound from "./pages/NotFound.tsx";
import Details from "./pages/RecipeDetails/Detail.tsx";
import Recipe from "./pages/RecipeDetails/Recipe.tsx";
// import MemberRegisteredList from "./pages/Account/MemberRegisteredList.tsx";
// Try creating these components in the "pages" folder

// import About from "./pages/About";
// import Contact from "./pages/Contact";

/* ************************************************************************* */

// Create router configuration with routes
// You can add more routes as you build out your app!
const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/Recettes",
        element: <Recipe />,
      },
      {
        path: "/Details",
        element: <Details />,
      },
      {
        path: "/Courses",
        element: <List />,
      },
      {
        path: "/Compte",
        element: <Account />,
      },
      {
        path: "/Mentions_legales",
        element: <Mentions />,
      },
      {
        path: "/A_propos",
        element: <About />,
      },
      {
        path: "/Mixer",
        element: <Mixer />,
      },
      {
        path: "/Admin",
        element: <Admin />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
    ],
  },
  // Try adding a new route! For example, "/about" with an About component
]);

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
