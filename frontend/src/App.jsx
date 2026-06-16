import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/admin/Login";
import AdminPanel from "./pages/admin/AdminPanel";
import FacultyPanel from "./pages/faculty/FacultyPanel";
import StudentPanel from "./pages/student/StudentPanel";
import "./App.css"; // ✅ Importing App.css

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin/*" element={<AdminPanel />} />
        {/* <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} /> */}
        <Route path="/faculty/*" element={<FacultyPanel />}/>
        <Route path="/student/*" element={<StudentPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

// ✅ Protected Route Component (Ensures authentication)
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" />;
};

export default App;