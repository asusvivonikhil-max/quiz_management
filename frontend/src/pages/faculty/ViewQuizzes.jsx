import React, { useState, useEffect } from "react";
import "../../style/ViewQuizzes.css";

const ViewQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyEmail, setFacultyEmail] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setFacultyEmail(user.email);
      fetchQuizzes(user.email);
    } else {
      setError("No user found. Please log in again.");
      setLoading(false);
    }
  }, []);

  const fetchQuizzes = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/faculty/view-quizzes?email=${email}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch quizzes");
      setQuizzes(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/faculty/toggle-status/${quizId}`, {
        method: "PATCH"
      });
      if (!response.ok) throw new Error("Failed to toggle status");

      // Update local state
      setQuizzes(quizzes.map(q => q.quizId === quizId ? { ...q, isActive: !q.isActive } : q));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="view-container">
      <h2>Your Created Quizzes</h2>

      {loading && <p>Loading quizzes...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && quizzes.length === 0 && <p>No quizzes found.</p>}

      {!loading && quizzes.length > 0 && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Quiz ID</th>
              <th>Subject</th>
              <th>Duration (min)</th>
              <th>Questions</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.quizId}>
                <td>{quiz.quizId}</td>
                <td>{quiz.subject}</td>
                <td>{quiz.duration}</td>
                <td>{quiz.nquestions}</td>
                <td style={{ fontWeight: "bold", color: quiz.isActive ? "#4CAF50" : "#ff4d4d" }}>
                  {quiz.isActive ? "ACTIVE" : "INACTIVE"}
                </td>
                <td>
                  <button 
                    onClick={() => toggleStatus(quiz.quizId)}
                    style={{ 
                      background: quiz.isActive ? "rgba(255, 77, 77, 0.1)" : "rgba(76, 175, 80, 0.1)",
                      color: quiz.isActive ? "#ff4d4d" : "#4CAF50",
                      border: `1px solid ${quiz.isActive ? "#ff4d4d" : "#4CAF50"}`,
                      width: "120px"
                    }}
                  >
                    {quiz.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  };

export default ViewQuizzes;