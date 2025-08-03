    import { useSelector } from "react-redux";
    import { Navigate, useLocation } from "react-router-dom";

    // Admin Route Protection
    export const AdminProtectedRoute = ({ children }) => {
    const { isAdmin, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to admin login if not authenticated
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // Redirect to home if authenticated but not admin
        return <Navigate to="/" replace />;
    }

    return children;
    };

    // User Route Protection
    export const UserProtectedRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to user login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (isAdmin) {
        // Redirect admin to admin dashboard
        return <Navigate to="/admin" replace />;
    }

    return children;
    };

    // Public Route (redirect if already logged in)
    export const PublicRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        if (adminOnly && isAdmin) {
        return <Navigate to="/admin" replace />;
        } else if (!adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
        }
    }

    return children;
    };
