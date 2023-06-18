import { Navigate } from "react-router-dom";
import useUserStore from "./userStore";

interface ProtectedRouteProps {
  access?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const ProtectedRoute = ({ access = true, fallback = <Navigate to="/login" replace />, children }: ProtectedRouteProps) => {
  const userData = useUserStore((state) => state.userData);

  if ((userData === undefined || userData === 'signed out') === access) {
    return fallback
  }
  return children
};

export default ProtectedRoute;
