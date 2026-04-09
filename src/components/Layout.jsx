import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  // Define routes where the Navbar should NOT be displayed
  const hideNavbarRoutes = ["/", "/signup", "/login"];

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* If the current path is NOT in our list, show the Navbar.
          This ensures /signup and /login stay clean with only DevCollab branding.
      */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;