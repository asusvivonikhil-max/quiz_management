import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/ViewQuizzes.css"; // Reuse styling if possible or create new

const AvailableQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("http://localhost:5000/student/quizzes");
                if (!response.ok) throw new Error("Failed to fetch quizzes");
                const data = await response.json();
                setQuizzes(data);
                setFilteredQuizzes(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const filtered = quizzes.filter(q => 
            q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.quizId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuizzes(filtered);
    }, [searchTerm, quizzes]);

    return (
        <div className="view-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Available Quizzes</h2>
                <input 
                    type="text" 
                    placeholder="Search by subject or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "300px", marginBottom: "0" }}
                />
            </div>
            {error && <p className="error">{error}</p>}
            {filteredQuizzes.length === 0 ? (
                <p>{searchTerm ? "No matching quizzes found." : "No quizzes available right now."}</p>
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
                        {filteredQuizzes.map((quiz) => (
                            <tr key={quiz.quizId}>
                                <td>{quiz.quizId}</td>
                                <td>{quiz.subject}</td>
                                <td>{quiz.duration}</td>
                                <td>{quiz.nquestions}</td>
                                <td>{quiz.createdBy}</td>
                                <td>
                                    <button 
                                        onClick={() => navigate(`/student/attempt-quiz?id=${quiz.quizId}`)}
                                        style={{ width: "100px", padding: "8px" }}
                                    >
                                        Attempt
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

export default AvailableQuizzes;
