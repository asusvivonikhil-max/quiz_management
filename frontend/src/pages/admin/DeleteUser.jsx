import { useState } from "react";
import "../../style/DeleteUser.css"; // optional if you want custom styles

const DeleteUser = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/auth/deleteUser", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delete-user-container">
      <h2>Delete User</h2>
      <p>Enter email of the user to delete:</p>
      <form className="delete-user-form" onSubmit={handleDelete}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Delete</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteUser;
