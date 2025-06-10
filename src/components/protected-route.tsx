import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}
