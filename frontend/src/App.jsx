// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import SeekerDashboard from "./pages/SeekerDashboard.jsx";
// import EmployerDashboard from "./pages/EmployerDashboard.jsx";
// import Navbar from "./components/Navbar.jsx";

// const Protected = ({ children, role }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="flex justify-center items-center h-screen">Loading…</div>;
//   if (!user) return <Navigate to="/login" replace />;
//   if (role && user.role !== role) return <Navigate to="/" replace />;
//   return children;
// };

// export default function App() {
//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route
//             path="/"
//             element={
//               <Protected>
//                 {({ user }) => (user.role === "seeker" ? <SeekerDashboard /> : <EmployerDashboard />)}
//               </Protected>
//             }
//           />
//         </Routes>
//       </div>
//     </>
//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SeekerDashboard from "./pages/SeekerDashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import Navbar from "./components/Navbar.jsx";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <Protected>
                {user?.role === "seeker" ? (
                  <SeekerDashboard />
                ) : (
                  <EmployerDashboard />
                )}
              </Protected>
            }
          />
        </Routes>
      </div>
    </>
  );
}