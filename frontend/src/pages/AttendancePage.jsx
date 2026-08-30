import { useEffect, useState } from "react";
import { CalendarDays, ClipboardCheck, LogIn, LogOut, Search } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { PageHeading, formatDate, formatTime } from "./DashboardPage";

export default function AttendancePage() {
  const { user } = useAuth();
  return user.role === "HR" ? <HRAttendance /> : <EmployeeAttendance />;
}

function HRAttendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.getAttendance({ employeeId, date });
      setRecords(res.data);
    } catch (err) { setError(err.message); }
  }

  useEffect(() => {
    api.getEmployees().then((res) => setEmployees(res.data)).catch(() => {});
    load();
  }, []);

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="HR Portal" title="Attendance Management" description="View attendance records and filter by employee or date." />

      <Card className="rounded-2xl p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <select className="h-10 rounded-lg border bg-white px-3 text-sm" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">All Employees</option>
            {employees.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={load}><Search className="h-4 w-4" /> Apply Filters</Button>
        </div>
      </Card>

      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <AttendanceTable records={records} />
    </div>
  );
}

function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await api.getMyAttendance();
    setRecords(res.data.history || []);
    setToday(res.data.today);
  }

  useEffect(() => { load().catch((e) => setMessage(e.message)); }, []);

  async function action(type) {
    setLoading(true);
    setMessage("");
    try {
      const res = type === "in" ? await api.checkIn() : await api.checkOut();
      setMessage(res.message);
      await load();
    } catch (e) {
      setMessage(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="Employee Portal" title="My Attendance" description="Check in, check out and view your attendance history." />

      <Card className="rounded-2xl p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500">Today's Attendance</div>
            <div className="mt-2 text-3xl font-medium">{today?.status || "Not Checked In"}</div>
            <div className="mt-2 text-sm text-slate-500">
              Check in: <b>{formatTime(today?.checkIn)}</b> · Check out: <b>{formatTime(today?.checkOut)}</b>
            </div>
          </div>
          <div className="flex gap-3">
            <Button disabled={loading || Boolean(today?.checkIn)} onClick={() => action("in")}><LogIn className="h-4 w-4" /> Check In</Button>
            <Button variant="outline" disabled={loading || !today?.checkIn || Boolean(today?.checkOut)} onClick={() => action("out")}><LogOut className="h-4 w-4" /> Check Out</Button>
          </div>
        </div>
        {message && <div className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</div>}
      </Card>

      <Card className="overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b p-5"><CalendarDays className="h-5 w-5 text-blue-600" /><div className="font-medium">Attendance History</div></div>
        <AttendanceTable records={records} />
      </Card>
    </div>
  );
}

function AttendanceTable({ records }) {
  if (!records.length) return <div className="p-5"><EmptyState title="No attendance records" /></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-white text-xs text-slate-500">
          <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Check In</th><th className="px-5 py-3">Check Out</th><th className="px-5 py-3">Status</th></tr>
        </thead>
        <tbody className="divide-y">
          {records.map((record) => (
            <tr key={record._id}>
              <td className="px-5 py-4 font-semibold">{record.employee?.name || "Me"}</td>
              <td className="px-5 py-4">{formatDate(record.date)}</td>
              <td className="px-5 py-4">{formatTime(record.checkIn)}</td>
              <td className="px-5 py-4">{formatTime(record.checkOut)}</td>
              <td className="px-5 py-4"><StatusBadge status={record.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
