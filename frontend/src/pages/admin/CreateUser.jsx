import { useState } from "react";
import "../../style/CreateUser.css"; // You can create this CSS file for styling

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    switch (name) {
      case "name":
        if (value.length > 0 && value.length < 3) errors.name = "Name must be at least 3 characters";
        else delete errors.name;
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) errors.email = "Invalid email format";
        else delete errors.email;
        break;
      case "password":
        if (value.length > 0 && value.length < 8) errors.password = "Password must be at least 8 characters";
        else if (value.length > 15) errors.password = "Password must be at most 15 characters";
        else delete errors.password;
        break;
      default:
        break;
    }
    setFieldErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "role") setRole(value);
    validateField(name, value);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the errors before submitting");
      return;
    }
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setMessage("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
      setFieldErrors({});
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create New User</h2>
      <p style={{ marginBottom: "20px" }}>Fill in the details to register a new user.</p>
      
      {/* Reserved space for Global Messages */}
      <div style={{ minHeight: "24px", marginBottom: "10px" }}>
        {message && <p className="success" style={{ color: "#4CAF50", margin: "0" }}>{message}</p>}
        {error && <p className="error" style={{ margin: "0" }}>{error}</p>}
      </div>

      <form onSubmit={handleCreateUser} className="create-user-form">
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={name}
            onChange={handleInputChange}
            required
            style={{ marginBottom: "4px" }}
          />
          <div style={{ minHeight: "18px" }}>
            {fieldErrors.name && <span style={{ color: "#ff4d4d", fontSize: "12px", display: "block" }}>{fieldErrors.name}</span>}
          </div>
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleInputChange}
            required
            style={{ marginBottom: "4px" }}
          />
          <div style={{ minHeight: "18px" }}>
            {fieldErrors.email && <span style={{ color: "#ff4d4d", fontSize: "12px", display: "block" }}>{fieldErrors.email}</span>}
          </div>
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <input
            type="password"
            name="password"
            placeholder="Enter Password (8-15 chars)"
            value={password}
            onChange={handleInputChange}
            required
            style={{ marginBottom: "4px" }}
          />
          <div style={{ minHeight: "18px" }}>
            {fieldErrors.password && <span style={{ color: "#ff4d4d", fontSize: "12px", display: "block" }}>{fieldErrors.password}</span>}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <select name="role" value={role} onChange={handleInputChange} required style={{ marginBottom: "0" }}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ minHeight: "18px" }}></div>
        </div>

        <button type="submit" disabled={Object.keys(fieldErrors).length > 0}>Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;