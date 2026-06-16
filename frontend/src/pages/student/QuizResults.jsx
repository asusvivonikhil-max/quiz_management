import { useEffect, useState } from "react";
import "../../style/ViewQuizzes.css"; 

const QuizResults = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) throw new Error("Not logged in");

                const response = await fetch(`http://localhost:5000/student/results?email=${user.email}`);
                if (!response.ok) throw new Error("Failed to fetch results");
                const data = await response.json();
                setResults(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="view-container">
            <h2>My Quiz Results</h2>
            {error && <p className="error">{error}</p>}
            {results.length === 0 ? (
                <p>You haven't attempted any quizzes yet.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Quiz ID</th>
                            <th>Subject</th>
                            <th>Score</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((res, i) => (
                            <tr key={i}>
                                <td>{res.quizId}</td>
                                <td>{res.subject}</td>
                                <td style={{ fontWeight: "bold", color: res.score > res.total/2 ? "green" : "red" }}>{res.score}</td>
                                <td>{res.total}</td>
                                <td>{new Date(res.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default QuizResults;
