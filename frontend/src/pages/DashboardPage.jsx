import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  UsersRound,
  UserCheck,
  BriefcaseBusiness
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>;
  if (!data) return <div className="py-20 text-center text-slate-500">Loading dashboard...</div>;

  if (user.role === "EMPLOYEE") return <EmployeeDashboard data={data} />;

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Overview"
        title={`Good morning, ${user.name.split(" ")[0]}`}
        description="Here's what's happening across your workforce today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Total Employees" value={data.totalEmployees} helper="Active employees" />
        <StatCard icon={UserCheck} label="Present Today" value={data.presentToday} helper="Checked in today" tone="emerald" />
        <StatCard icon={CalendarDays} label="On Leave" value={data.onLeaveToday} helper="Approved leave today" tone="amber" />
        <StatCard icon={FileText} label="Pending Leaves" value={data.pendingLeaves} helper="Need HR action" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">Recent Attendance Activity</h2>
              <p className="mt-1 text-xs text-slate-500">Latest employee attendance events.</p>
            </div>
            <Clock3 className="h-5 w-5 text-slate-300" />
          </div>

          <div className="mt-6 overflow-x-auto">
            {data.recentAttendance.length ? (
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b text-xs text-slate-400">
                  <tr><th className="pb-3">Employee</th><th className="pb-3">Date</th><th className="pb-3">Check In</th><th className="pb-3">Check Out</th><th className="pb-3">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {data.recentAttendance.map((row) => (
                    <tr key={row._id}>
                      <td className="py-4 font-semibold">{row.employee?.name}</td>
                      <td className="py-4 text-slate-500">{formatDate(row.date)}</td>
                      <td className="py-4">{formatTime(row.checkIn)}</td>
                      <td className="py-4">{formatTime(row.checkOut)}</td>
                      <td className="py-4"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState title="No attendance activity yet" />}
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">Leave Overview</h2>
              <p className="mt-1 text-xs text-slate-500">Current request queue.</p>
            </div>
            <FileText className="h-5 w-5 text-slate-300" />
          </div>
          <div className="mt-6 space-y-4">
            {data.recentLeaves.length ? data.recentLeaves.map((leave) => (
              <div key={leave._id} className="rounded-xl bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{leave.employee?.name}</div>
                  <StatusBadge status={leave.status} />
                </div>
                <div className="mt-1 text-xs text-slate-500">{leave.leaveType} · {formatDate(leave.startDate)} to {formatDate(leave.endDate)}</div>
              </div>
            )) : <EmptyState title="No leave requests" />}
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmployeeDashboard({ data }) {
  const { user } = useAuth();
  const attendance = data.todayAttendance;

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Employee Portal"
        title={`Welcome, ${user.name.split(" ")[0]}`}
        description="Your attendance, leave and personal workspace."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Clock3} label="Today's Attendance" value={attendance?.status || "Not Checked In"} tone={attendance?.checkIn ? "emerald" : "blue"} />
        <StatCard icon={CalendarDays} label="Leave Balance" value={`${data.leaveBalance} days`} helper="Remaining this cycle" tone="amber" />
        <StatCard icon={BriefcaseBusiness} label="Department" value={user.department || "—"} helper={user.designation || "Employee"} tone="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="card-title">Personal Information</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Name" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phone || "—"} />
            <Info label="Date of Joining" value={formatDate(user.dateOfJoining)} />
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="card-title">Today's Attendance</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Info label="Check In" value={formatTime(attendance?.checkIn)} />
            <Info label="Check Out" value={formatTime(attendance?.checkOut)} />
          </div>
          <div className="mt-5">
            <StatusBadge status={attendance?.status || "Not Checked In"} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="text-xs font-medium uppercase tracking-[.18em] text-blue-600">{eyebrow}</div>}
        <h1 className="page-title mt-1">{title}</h1>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  );
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
