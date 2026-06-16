import { useEffect, useState } from "react";
import "../../style/ViewQuizzes.css";

const FacultyResults = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const response = await fetch(`http://localhost:5000/faculty/results?email=${user.email}`);
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
            <h2>Student Quiz Performance</h2>
            {error && <p className="error">{error}</p>}
            {results.length === 0 ? (
                <p>No students have taken your quizzes yet.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Student Email</th>
                            <th>Quiz ID</th>
                            <th>Subject</th>
                            <th>Score</th>
                            <th>Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((res, i) => (
                            <tr key={i}>
                                <td>{res.studentEmail}</td>
                                <td>{res.quizId}</td>
                                <td>{res.subject}</td>
                                <td style={{ fontWeight: "600", color: res.score >= res.total/2 ? "#4CAF50" : "#ff4d4d" }}>
                                    {res.score} / {res.total}
                                </td>
                                <td>{new Date(res.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FacultyResults;
