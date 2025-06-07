import { ArrowUpRight, Clock, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import GanttChart from "../components/GanttChart";
import { formatDate, getStatusInfo } from "../lib/utils";

const Dashboard = () => {
  const { projects, loading } = useProjects();

  // Statistics
  const stats = {
    active: projects.filter((p) => p.status === "active").length,
    planning: projects.filter((p) => p.status === "planning").length,
    completed: projects.filter((p) => p.status === "completed").length,
    total: projects.length,
  };

  // Get upcoming events
  const upcoming = [...projects]
    .filter((p) => new Date(p.eventDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    )
    .slice(0, 3);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/calculator"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          New Launch
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Clock size={16} />
            <span className="text-sm">Active</span>
          </div>
          <div className="text-2xl font-bold">{stats.active}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-sm">Planning</span>
          </div>
          <div className="text-2xl font-bold">{stats.planning}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <CheckCircle size={16} />
            <span className="text-sm">Completed</span>
          </div>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-sm">Total</span>
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Project Timeline</h2>
        <GanttChart projects={projects} />
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((project) => {
              const { color, label } = getStatusInfo(project.status);

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="bg-card border rounded-lg p-4 hover:border-primary transition-colors project-card"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                      {label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {project.client || "No client"}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <Calendar size={14} className="text-primary" />

                    <span>
                      Event:{" "}
                      {formatDate(new Date(project.eventDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No upcoming events</p>
            <Link
              to="/calculator"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Create your first launch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
