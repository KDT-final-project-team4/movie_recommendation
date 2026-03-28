import { createBrowserRouter } from "react-router";
import { UserSelect } from "./components/user-select";
import { HomeDashboard } from "./components/home-dashboard";
import { SearchResults } from "./components/search-results";

export const router = createBrowserRouter([
  { path: "/", Component: UserSelect },
  { path: "/home/:userId", Component: HomeDashboard },
  { path: "/search/:userId", Component: SearchResults },
]);
