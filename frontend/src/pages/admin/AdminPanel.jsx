import { useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/Dashboard";
import CreateUser from "./CreateUser";
import DeleteUser from "./DeleteUser";
import ViewUsers from "./ViewUsers";
import WelcomeStats from "../../Dashboard/WelcomeStats";

const adminOptions = [
  { path: "create-user", label: "Create User" },
  { path: "delete-users", label: "Delete Users" },
  { path: "view-users", label: "View Users" },
  // { path: "start-quiz", label: "Start Quiz" },
  // { path: "stop-quiz", label: "Stop Quiz" },
];

const AdminPanel = () => {
  const location = useLocation();
  const path = location.pathname.replace("/admin/", "");

  // Map path to component
  const renderContent = () => {
    switch (path) {
      case "create-user":
        return <CreateUser />;
      case "delete-users":
        return <DeleteUser />;
      case "view-users":
        return <ViewUsers />;
      default:
        return <WelcomeStats role="Admin" />;
    }
  };

  return <Dashboard role="Admin" options={adminOptions}>{renderContent()}</Dashboard>;
};

export default AdminPanel;