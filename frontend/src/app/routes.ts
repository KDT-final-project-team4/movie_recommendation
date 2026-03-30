import { createBrowserRouter } from "react-router";
import { UserSelect } from "./components/user-select";
import { HomeDashboard } from "./components/home-dashboard";
import { SearchResults } from "./components/search-results";
import { SlideDeck } from "./components/slide-deck";

export const router = createBrowserRouter([
  { path: "/", Component: UserSelect },
  { path: "/slides", Component: SlideDeck },
  { path: "/home/:userId", Component: HomeDashboard },
  { path: "/search/:userId", Component: SearchResults },
]);
