import { useEffect, useState } from "react";

const WelcomeStats = ({ role }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                let url = "";
                if (role === "Admin") url = "http://localhost:5000/api/auth/stats";
                else if (role === "Faculty") url = `http://localhost:5000/faculty/stats?email=${user.email}`;
                else if (role === "Student") url = `http://localhost:5000/student/stats?email=${user.email}`;

                const response = await fetch(url);
                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error("Stats Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [role]);

    if (loading) return <h3>Loading Dashboard...</h3>;

    const statCards = [];
    if (role === "Admin" && stats) {
        statCards.push({ label: "Total Users", value: stats.totalUsers });
        statCards.push({ label: "Total Quizzes", value: stats.totalQuizzes });
        statCards.push({ label: "Active Quizzes", value: stats.activeQuizzes });
        statCards.push({ label: "Total Submissions", value: stats.totalSubmissions });
    } else if (role === "Faculty" && stats) {
        statCards.push({ label: "My Quizzes", value: stats.totalQuizzes });
        statCards.push({ label: "Active Now", value: stats.activeQuizzes });
        statCards.push({ label: "Total Attempts", value: stats.totalSubmissions });
    } else if (role === "Student" && stats) {
        statCards.push({ label: "Quizzes Taken", value: stats.totalTaken });
        statCards.push({ label: "Available Quizzes", value: stats.activeQuizzes });
        statCards.push({ label: "Average Score", value: `${stats.avgScore}%` });
    }

    return (
        <div style={{ width: "100%", maxWidth: "900px" }}>
            <h2 style={{ marginBottom: "30px", fontSize: "32px" }}>Welcome to your {role} Dashboard</h2>
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "20px",
                width: "100%"
            }}>
                {statCards.map((card, i) => (
                    <div key={i} className="card" style={{ padding: "25px", textAlign: "center" }}>
                        <h4 style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "10px", textTransform: "uppercase" }}>{card.label}</h4>
                        <h2 style={{ color: "var(--primary-color)", fontSize: "36px", margin: "0" }}>{card.value}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WelcomeStats;
