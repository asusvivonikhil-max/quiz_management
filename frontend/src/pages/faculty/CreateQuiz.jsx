import React, { useState } from "react";
import "../../style/CreateQuiz.css";

const CreateQuiz = () => {
  const [step, setStep] = useState(1);

  // Get logged in user email
  const userStr = localStorage.getItem("user");
  const userEmail = userStr ? JSON.parse(userStr).email : "";

  const [quizInfo, setQuizInfo] = useState({
    quizId: "",
    subject: "",
    duration: "",
    nquestions: "",
    createdBy: userEmail, // Auto-fill with user's email
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct: "",
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (quizInfo.questions.length < quizInfo.nquestions) {
        setQuizInfo({ ...quizInfo, questions: [...quizInfo.questions, currentQuestion] });
        setCurrentQuestion({
          question: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct: "",
        });
      }
      if (quizInfo.questions.length + 1 >= quizInfo.nquestions) {
        setStep(3);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/faculty/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizInfo),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create quiz");
      }

      alert("Quiz Created Successfully!");
      setStep(1);
      setQuizInfo({
        quizId: "",
        subject: "",
        duration: "",
        nquestions: "",
        createdBy: "",
        questions: [],
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-card">
        <div className="create-quiz-content">
          {step === 1 && (
            <div>
              <h2 className="create-quiz-title">Step 1: Quiz Info</h2>
              <input className="create-quiz-input" placeholder="Quiz ID" value={quizInfo.quizId} onChange={(e) => setQuizInfo({ ...quizInfo, quizId: e.target.value })} />
              <input className="create-quiz-input" placeholder="Subject" value={quizInfo.subject} onChange={(e) => setQuizInfo({ ...quizInfo, subject: e.target.value })} />
              <input className="create-quiz-input" type="text" placeholder="Created By (Email)" value={quizInfo.createdBy} onChange={(e) => setQuizInfo({ ...quizInfo, createdBy: e.target.value })} />
              <input className="create-quiz-input" type="text" placeholder="Number of Questions" value={quizInfo.nquestions} onChange={(e) => setQuizInfo({ ...quizInfo, nquestions: Number(e.target.value) })} />
              <input className="create-quiz-input" type="text" placeholder="Duration (minutes)" value={quizInfo.duration} onChange={(e) => setQuizInfo({ ...quizInfo, duration: Number(e.target.value) })} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="create-quiz-title">Step 2: Add Question</h2>
              <input className="create-quiz-input" placeholder="Question" value={currentQuestion.question} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} />
              <input className="create-quiz-input" placeholder="Option A" value={currentQuestion.option_a} onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_a: e.target.value })} />
              <input className="create-quiz-input" placeholder="Option B" value={currentQuestion.option_b} onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_b: e.target.value })} />
              <input className="create-quiz-input" placeholder="Option C" value={currentQuestion.option_c} onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_c: e.target.value })} />
              <input className="create-quiz-input" placeholder="Option D" value={currentQuestion.option_d} onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_d: e.target.value })} />
              <input className="create-quiz-input" placeholder="Correct Answer" value={currentQuestion.correct} onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct: e.target.value })} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="create-quiz-title">Step 3: Confirm & Submit</h2>
              <p><strong>Quiz ID:</strong> {quizInfo.quizId}</p>
              <p><strong>Subject:</strong> {quizInfo.subject}</p>
              <p><strong>Created By:</strong> {quizInfo.createdBy}</p>
              <p><strong>Number of Questions:</strong> {quizInfo.nquestions}</p>
              <p><strong>Duration:</strong> {quizInfo.duration} minutes</p>
              <p><strong>Questions Added:</strong> {quizInfo.questions.length}</p>
            </div>
          )}

          <div className="create-quiz-buttons">
            {step > 1 && <button className="back" onClick={() => setStep(step - 1)}>Back</button>}
            {step === 3 ? <button className="submit" onClick={handleSubmit}>Submit Quiz</button> : <button className="next" onClick={handleNext}>Next</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;