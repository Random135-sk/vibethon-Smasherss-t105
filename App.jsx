// App.jsx — Root component with routing + AuthProvider
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import Quiz from "./pages/Quiz";
import MiniGames from "./pages/MiniGames";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Protected route: redirects to /login if not authenticated
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

// Layout wraps every page except /login (login has its own full-page layout)
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <ScrollToTop />
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/playground" element={<PrivateRoute><Playground /></PrivateRoute>} />
            <Route path="/quiz"       element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/games"      element={<PrivateRoute><MiniGames /></PrivateRoute>} />
            <Route path="/simulate"   element={<PrivateRoute><Simulation /></PrivateRoute>} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
