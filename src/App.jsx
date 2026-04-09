import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateSnippet from "./pages/CreateSnippet";
import SnippetDetails from "./pages/SnippetDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import LikedUsers from "./pages/LikedUsers";
import SnippetReviews from "./pages/SnippetReview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },

      { path: "home", element: <Home /> },

      { path: "login", element: <Login /> },

      { path: "signup", element: <Signup/> },

      { path: "create", element: <ProtectedRoute><CreateSnippet /></ProtectedRoute> },

      { path: "snippet/:id", element: <SnippetDetails /> },

      { path: "profile/:id", element: <Profile /> },

      { path: "editprofile/:id", element: <EditProfile /> },

      { path: "/snippet/:id/likes", element: <LikedUsers /> },

      { path: "/snippet/:id/reviews", element: <SnippetReviews /> }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;