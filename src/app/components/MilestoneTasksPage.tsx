import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Filter,
  Loader2,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";

// ─── API instance ─────────────────────────────────────────────────────────────

const API = axios.create({ baseURL: "https://captrack-backend-3c36.onrender.com/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["x-auth-token"] = token;
  return config;
});

type TaskItem = {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "inProgress" | "completed";
  priority: "Low" | "Medium" | "High";
  due: string;
  assignedTo: string;
  note: string;
  group: string;
  project: string;
  projectProgress: number;
};

type GroupSummary = {
  projectId: string;
  group: string;
  project: string;
  progress: number;
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  completed: "Completed",
};

const statusStyles: Record<string, string> = {
  todo: "bg-slate-100 text-slate-700",
  inProgress: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const priorityStyles: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

export function MilestoneTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadTasks = () => {
    setLoading(true);
    setError("");
    API.get("/tasks/supervisor/all")
      .then((res) => {
        setTasks(res.data.tasks || []);
        setGroups(res.data.groups || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load milestone tasks.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateMilestone = async () => {
    if (groups.length === 0) {
      alert("You don't have any assigned groups yet, so there's nowhere to add a milestone task.");
      return;
    }
    const groupNames = groups.map((g) => g.group).join(", ");
    const chosenGroup = window.prompt(`Which group is this task for? (${groupNames})`, groups[0].group);
    if (!chosenGroup) return;
    const target = groups.find((g) => g.group.toLowerCase() === chosenGroup.trim().toLowerCase());
    if (!target) {
      alert("Couldn't find that group. Please type the group name exactly as shown.");
      return;
    }
    const title = window.prompt("Task title:");
    if (!title) return;
    const due = window.prompt("Due date (e.g. Jul 20, 2026):", "");
    const assignedTo = window.prompt("Assign to (student name):", "");

    try {
      await API.post(`/tasks/${target.projectId}`, {
        title,
        status: "todo",
        priority: "Medium",
        due: due || "",
        assignedTo: assignedTo || "Unassigned",
      });
      loadTasks();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create milestone task.");
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskItem>) => {
    setBusyId(id);
    try {
      await API.patch(`/tasks/${id}`, updates);
      loadTasks();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (task: TaskItem) => updateTask(task.id, { status: "completed" });

  const handleAddFeedback = (task: TaskItem) => {
    const note = window.prompt("Feedback for this task:", task.note || "");
    if (note === null) return;
    updateTask(task.id, { note });
  };

  const handleExtendDeadline = (task: TaskItem) => {
    const due = window.prompt("New due date:", task.due || "");
    if (due === null || due.trim() === "") return;
    updateTask(task.id, { due });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !search ||
      [task.title, task.group, task.project, task.assignedTo]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesGroup = groupFilter === "All Groups" || task.group === groupFilter;
    const matchesStatus = statusFilter === "All Status" || task.status === statusFilter;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  return (
    <section className="min-h-screen bg-[#f3f6fa] px-8 py-8">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <div
            className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            CapTrack · Supervisor
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Milestone Tasks
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Monitor group-wise milestone tasks, review task progress, identify
            overdue work, and provide supervisor feedback.
          </p>
        </div>

        <button
          onClick={handleCreateMilestone}
          className="flex items-center gap-2 rounded-full bg-[#0f5f8f] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0d4f78]"
        >
          <ClipboardCheck size={17} />
          Create Milestone
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by group, task, assignee, milestone, or project..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
          >
            <option>All Groups</option>
            {groups.map((g) => (
              <option key={g.group}>{g.group}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
          >
            <option>All Status</option>
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-slate-500">
          <Loader2 size={18} className="animate-spin" />
          Loading milestone tasks...
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {filteredTasks.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No milestone tasks found. {tasks.length === 0 && "Create one with the button above, or wait for your assigned groups to add tasks."}
              </div>
            )}

            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                      >
                        {statusLabels[task.status]}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Medium}`}
                      >
                        {task.priority} Priority
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {task.group}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-950">
                      {task.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">{task.project}</p>
                  </div>

                  <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
                    {task.projectProgress}% Progress
                  </div>
                </div>

                <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-4">
                  <InfoItem label="Assigned To" value={task.assignedTo || "Unassigned"} />
                  <InfoItem label="Due Date" value={task.due || "Not set"} />
                  <InfoItem label="Group" value={task.group} />
                  <InfoItem label="Status" value={statusLabels[task.status]} />
                </div>

                {task.note && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-800">Supervisor note: </span>
                    {task.note}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAddFeedback(task)}
                    disabled={busyId === task.id}
                    className="flex items-center gap-2 rounded-xl bg-[#0f5f8f] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <MessageSquare size={17} />
                    Add Feedback
                  </button>

                  <button
                    onClick={() => handleApprove(task)}
                    disabled={busyId === task.id || task.status === "completed"}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <CheckCircle2 size={17} />
                    {task.status === "completed" ? "Approved" : "Approve"}
                  </button>

                  <button
                    onClick={() => handleExtendDeadline(task)}
                    disabled={busyId === task.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
                  >
                    <CalendarDays size={17} />
                    Extend Deadline
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-slate-950">
                  Attention Needed
                </h3>
              </div>

              {pendingTasks.length === 0 ? (
                <p className="text-slate-600">Nothing needs attention right now — all caught up.</p>
              ) : (
                <ul className="space-y-2">
                  {pendingTasks.slice(0, 5).map((t) => (
                    <li key={t.id} className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">{t.group}:</span> {t.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Users size={18} className="text-cyan-700" />
                <h3 className="text-lg font-semibold text-slate-950">
                  Group Summary
                </h3>
              </div>

              {groups.length === 0 ? (
                <p className="text-sm text-slate-500">No assigned groups yet.</p>
              ) : (
                <div className="space-y-3">
                  {groups.map((g) => (
                    <GroupProgress
                      key={g.group}
                      group={g.group}
                      project={g.project}
                      progress={g.progress}
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="mb-1 text-xs uppercase tracking-wide text-slate-500"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </div>
      <div className="font-medium text-slate-800">{value}</div>
    </div>
  );
}

function GroupProgress({
  group,
  project,
  progress,
}: {
  group: string;
  project: string;
  progress: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">{group}</div>
          <div className="text-sm text-slate-500">{project}</div>
        </div>

        <div className="text-sm font-semibold text-cyan-700">{progress}%</div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-cyan-600"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
