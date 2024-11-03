import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createBrowserRouter, Outlet, RouterProvider, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import LoginPage from "./components/LoginPage";
import StudentProgress from "./components/StudentProgress";
import TechnicalReport from "./components/TechnicalReport";
import NonTechnicalReport from "./components/NonTechnicalReport";
import { WithLogoAnimation, StyleTag } from './LogoLoadingAnimation';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) {
        return null; // Return null to prevent flash of protected content
    }

    return children;
};

// Public Route wrapper component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('access');
    
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppLayout = () => {
    return (
      <>
        <StyleTag />
        <WithLogoAnimation>
          <div className="flex flex-col min-h-screen">
            <header>
              <Header />
            </header>
            <main className="flex-grow">
              <Outlet />
            </main>
            <footer>
              <Footer />
            </footer>
          </div>
        </WithLogoAnimation>
      </>
    );
  };

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
            },
            {
                path: "login",
                element: (
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                ),
            },
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "student-progress",
                element: (
                    <ProtectedRoute>
                        <StudentProgress />
                    </ProtectedRoute>
                ),
            },
            {
                path: "technical-report",
                element: (
                    <ProtectedRoute>
                        <TechnicalReport />
                    </ProtectedRoute>
                ),
            },
            {
                path: "non-technical-report",
                element: (
                    <ProtectedRoute>
                        <NonTechnicalReport />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <RouterProvider router={appRouter} />
    </React.StrictMode>
);