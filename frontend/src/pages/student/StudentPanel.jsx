import { useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/Dashboard";
import AvailableQuizzes from "./AvailableQuizzes";
import AttemptQuiz from "./AttemptQuiz";
import QuizResults from "./QuizResults";
import WelcomeStats from "../../Dashboard/WelcomeStats";

const studentOptions = [
  { path: "available-quizzes", label: "Available Quizzes" },
  { path: "quiz-results", label: "Quiz Results" },
];

const StudentPanel = () => {
  const location = useLocation();
  const path = location.pathname.replace("/student/", "");

  const renderContent = () => {
    switch (path) {
      case "available-quizzes":
        return <AvailableQuizzes />;
      case "attempt-quiz":
        return <AttemptQuiz />;
      case "quiz-results":
        return <QuizResults />;
      default:
        return <WelcomeStats role="Student" />;
    }
  };

  return <Dashboard role="Student" options={studentOptions}>{renderContent()}</Dashboard>;
};

export default StudentPanel;
