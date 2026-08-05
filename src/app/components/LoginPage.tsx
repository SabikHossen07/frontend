import { useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";

type Role = "student" | "supervisor" | "admin";

interface LoginUser {
  name: string;
  email: string;
  role: Role;
}

interface LoginPageProps {
  onLogin: (user: LoginUser) => void;
}

// Render Backend URL Integration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://captrack-backend-3c36.onrender.com";

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);

  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("sabik@std.ewubd.edu");
  const [password, setPassword] = useState("captrack123");
  const [accountType, setAccountType] = useState<Role>("student");

  // UI Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { name, email, password, role: accountType }
      : { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setSuccessMessage("Account created successfully! Please log in.");
          setIsRegister(false);
        } else {
          if (data.token) {
            localStorage.setItem("token", data.token);
          }

          const loggedUser: LoginUser = {
            name: data.user?.name || name || email.split("@")[0],
            email: data.user?.email || email,
            role: (data.user?.role as Role) || accountType || "student",
          };

          onLogin(loggedUser);
        }
      } else {
        setErrorMessage(
          data.message ||
            (isRegister ? "Account creation failed." : "Login failed. Check credentials.")
        );
      }
    } catch (error) {
      setErrorMessage(
        "Server connection error! Render server is waking up. Please try again in 20 seconds."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f2744] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Hero Section */}
        <section className="relative hidden overflow-hidden px-12 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-24 right-12 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CapTrack</h1>
                <p className="text-sm text-cyan-100/70">East West University</p>
              </div>
            </div>

            <div className="mt-24 max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles size={16} />
                Capstone Project Lifecycle Management System
              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight">
                Manage your capstone journey from team formation to final defense.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200/80">
                CapTrack helps students find teammates, request supervisors,
                manage project milestones, submit deliverables, receive feedback,
                and track real-time progress in one platform.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<Users size={20} />}
              title="Team Matching"
              description="Find compatible teammates by skills and research interest."
            />
            <FeatureCard
              icon={<ShieldCheck size={20} />}
              title="Supervisor Flow"
              description="Explore supervisor domains, slots, and project history."
            />
            <FeatureCard
              icon={<GraduationCap size={20} />}
              title="Progress Tracking"
              description="Track milestones, submissions, feedback, and evaluation."
            />
          </div>
        </section>

        {/* Form Section */}
        <section className="flex items-center justify-center bg-slate-50 px-6 py-10 text-slate-950">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">CapTrack</h1>
                  <p className="text-sm text-slate-500">East West University</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-700">
                  {isRegister ? "Create Account" : "Welcome Back"}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  {isRegister ? "Join CapTrack" : "Login to CapTrack"}
                </h2>
                <p className="mt-2 text-slate-500">
                  {isRegister
                    ? "Create an account with your EWU email."
                    : "Use your university account to continue."}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Full Name
                      </span>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <User size={18} className="text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-900 outline-none"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Account Type
                      </span>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <select
                          value={accountType}
                          onChange={(e) => setAccountType(e.target.value as Role)}
                          className="w-full bg-transparent text-sm text-slate-900 outline-none"
                        >
                          <option value="student">Student (@std.ewubd.edu)</option>
                          <option value="supervisor">Supervisor / Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </label>
                  </>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="hossen@std.ewubd.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                </label>

                {!isRegister && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                      <input type="checkbox" defaultChecked />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="font-medium text-cyan-700 hover:text-cyan-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f5f8f] px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-900/20 transition hover:bg-[#0b527d] disabled:opacity-50"
                >
                  {loading
                    ? isRegister
                      ? "Creating Account..."
                      : "Logging in..."
                    : isRegister
                    ? "Create account"
                    : "Login"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                {isRegister ? "Already have an account? " : "Do not have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="font-semibold text-cyan-700 hover:underline"
                >
                  {isRegister ? "Login" : "Create account"}
                </button>
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Demo UI for Group 5 CapTrack project prototype.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-100">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200/70">{description}</p>
    </div>
  );
}