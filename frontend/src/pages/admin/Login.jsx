import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Login Response:", data);  // Debugging

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Store user
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
 // Ensure correct user object is stored

        console.log("Stored User:", localStorage.getItem("user"));  // Debugging

        switch (data.role) {
            case "admin":
                navigate("/admin");
                break;
            case "faculty":
                navigate("/faculty");
                break;
            case "student":
                navigate("/student");
                break;
            default:
                navigate("/");
        }
    } catch (err) {
        setError(err.message);
    }
};


    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <p>Enter your credentials to access the dashboard</p>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Enter Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
