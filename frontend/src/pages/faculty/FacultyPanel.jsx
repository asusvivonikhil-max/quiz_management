import { useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/Dashboard";
import CreateQuiz from "./CreateQuiz";
import ViewQuizzes from "./ViewQuizzes";
import FacultyResults from "./FacultyResults";
import WelcomeStats from "../../Dashboard/WelcomeStats";

const facultyOptions = [
  { path: "create-quiz", label: "Create Quiz" },
  { path: "view-quizzes", label: "View Quizzes" },
  { path: "student-results", label: "Student Results" },
];

const FacultyPanel = () => {
  const location = useLocation();
  const path = location.pathname.replace("/faculty/", "");

  const renderContent = () => {
    switch (path) {
      case "create-quiz":
        return <CreateQuiz />;
      case "view-quizzes":
        return <ViewQuizzes />;
      case "student-results":
        return <FacultyResults />;
      default:
        return <h3>Welcome to Faculty Dashboard</h3>;
    }
  };

  return <Dashboard role="Faculty" options={facultyOptions}>{renderContent()}</Dashboard>;
};

export default FacultyPanel;