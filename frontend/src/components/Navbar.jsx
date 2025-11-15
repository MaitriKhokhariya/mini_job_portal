import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            MiniJobPortal
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="btn btn-sm">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}