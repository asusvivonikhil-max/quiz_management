import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Dashboard.css";

const Dashboard = ({ role, options,children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ Update state when localStorage changes
    }
  }, []); // ✅ Runs once when component loads

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-details">
            <div className="items">
            <h5>{role} Dashboard</h5>
            <h5>Name: {user.name || "N/A"}</h5>
            <h5>Email: {user.email || "N/A"}</h5>
            <button className="logout" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user"); // ✅ Remove user from storage
            window.location.href = "/";
          }}>Logout</button>
            </div>
            
        </div>
      </div>

      <div className="dashboard-content">
        <nav className="dashboard-sidebar">
          <ul>
            {options.map((option) => (
              <li key={option.path}>
                <Link to={`/${role.toLowerCase()}/${option.path}`}>{option.label}</Link>
              </li>
            ))}
          </ul>
          
        </nav>

        <div className="dashboard-main">
          {/* <h3>Welcome to {role} Dashboard</h3> */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;