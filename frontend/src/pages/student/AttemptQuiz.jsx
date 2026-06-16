import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../style/CreateQuiz.css"; 

const AttemptQuiz = () => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Parse quiz ID from URL
    const queryParams = new URLSearchParams(location.search);
    const quizIdFromUrl = queryParams.get("id");

    useEffect(() => {
        if (quizIdFromUrl && !quiz && !result) {
            autoFetchQuiz(quizIdFromUrl);
        }
    }, [quizIdFromUrl]);

    useEffect(() => {
        if (timeLeft === 0) {
            submitQuiz();
        }
        if (timeLeft === null) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft]);

    const autoFetchQuiz = async (id) => {
        setError("");
        try {
            const response = await fetch(`http://localhost:5000/student/quiz/${id}`);
            if (!response.ok) throw new Error("Quiz not found");
            const data = await response.json();
            setQuiz(data);
            setAnswers({});
            setTimeLeft(data.duration * 60);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOptionSelect = (qIndex, optionValue) => {
        if (timeLeft <= 0) return; 
        setAnswers({ ...answers, [qIndex]: optionValue });
    };

    const submitQuiz = async () => {
        clearInterval(timerRef.current);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("Not logged in");

            const response = await fetch("http://localhost:5000/student/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentEmail: user.email,
                    quizId: quiz ? quiz.quizId : quizIdFromUrl,
                    answers
                })
            });

            if (!response.ok) throw new Error("Submission failed");
            const data = await response.json();
            setResult(data);
            setQuiz(null);
            setTimeLeft(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="create-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Attempt Quiz</h2>
                {timeLeft !== null && (
                    <div style={{ 
                        background: timeLeft < 60 ? "rgba(255, 77, 77, 0.2)" : "rgba(79, 195, 247, 0.2)", 
                        padding: "10px 20px", 
                        borderRadius: "8px",
                        border: `1px solid ${timeLeft < 60 ? "#ff4d4d" : "#4fc3f7"}`,
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: timeLeft < 60 ? "#ff4d4d" : "#4fc3f7"
                    }}>
                        Time Left: {formatTime(timeLeft)}
                    </div>
                )}
            </div>
            {error && <p className="error">{error}</p>}
            
            {!quiz && !result && !error && <p>Loading quiz details...</p>}

            {quiz && (
                <div className="quiz-attempt">
                    <h3>{quiz.subject}</h3>
                    <p>Duration: {quiz.duration} mins</p>
                    <div className="questions-list">
                        {quiz.questions.map((q, i) => (
                            <div key={i} className="question-card" style={{ textAlign: "left", marginBottom: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
                                <h4>Q{i + 1}: {q.question}</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                                    {['a', 'b', 'c', 'd'].map(opt => (
                                        <label key={opt} style={{ cursor: "pointer" }}>
                                            <input 
                                                type="radio" 
                                                name={`q-${i}`} 
                                                value={opt} 
                                                checked={answers[i] === opt}
                                                onChange={() => handleOptionSelect(i, opt)}
                                            />
                                            {` ${opt.toUpperCase()}. ${q[`option_${opt}`]}`}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={submitQuiz} style={{ marginTop: "20px" }}>Submit Quiz</button>
                </div>
            )}

            {result && (
                <div className="result-card" style={{ background: "#e0ffe0", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                    <h3>Quiz Submitted Successfully!</h3>
                    <h2>Score: {result.score} / {result.total}</h2>
                    <button onClick={() => navigate("/student/available-quizzes")}>Back to Quizzes</button>
                </div>
            )}
        </div>
    );
};

export default AttemptQuiz;
