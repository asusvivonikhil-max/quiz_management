import { useEffect, useState } from "react";
import "../../style/ViewQuizzes.css"; 

const ViewQuizes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/allQuizzes");
            if (!response.ok) throw new Error("Failed to fetch quizzes");
            const data = await response.json();
            setQuizzes(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (quizId) => {
        if (!window.confirm(`Are you sure you want to delete quiz ${quizId}?`)) return;
        
        try {
            const response = await fetch("http://localhost:5000/api/auth/deleteQuiz", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quizId })
            });

            if (!response.ok) throw new Error("Failed to delete quiz");
            fetchQuizzes(); // Refresh list after deletion
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="view-container">
            <h2>All Quizzes (Admin)</h2>
            {error && <p className="error">{error}</p>}
            {quizzes.length === 0 ? (
                <p>No quizzes available right now.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Quiz ID</th>
                            <th>Subject</th>
                            <th>Duration (mins)</th>
                            <th>Questions</th>
                            <th>Created By</th>
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
                                <td>{quiz.createdBy}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(quiz.quizId)}
                                        style={{ background: "#ff4d4d", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Delete
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

export default ViewQuizes;
