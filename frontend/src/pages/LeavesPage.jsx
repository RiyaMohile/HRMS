import { useEffect, useState } from "react";
import { Check, FileText, Plus, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { PageHeading, formatDate } from "./DashboardPage";

export default function LeavesPage() {
  const { user } = useAuth();
  return user.role === "HR" ? <HRLeaves /> : <EmployeeLeaves />;
}

function HRLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.getLeaves({ status });
      setLeaves(res.data);
    } catch (err) { setError(err.message); }
  }

  useEffect(() => { load(); }, []);

  async function update(id, nextStatus) {
    try {
      await api.updateLeave(id, nextStatus);
      load();
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="HR Portal" title="Leave Management" description="Review, approve and reject employee leave requests." />

      <Card className="rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {["", "Pending", "Approved", "Rejected"].map((item) => (
            <Button key={item || "all"} variant={status === item ? "default" : "outline"} size="sm" onClick={() => { setStatus(item); setTimeout(load, 0); }}>
              {item || "All Requests"}
            </Button>
          ))}
        </div>
      </Card>

      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <Card className="overflow-hidden rounded-2xl">
        {leaves.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-white text-xs text-slate-500">
                <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Dates</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr>
              </thead>
              <tbody className="divide-y">
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-5 py-4"><div className="font-medium">{leave.employee?.name}</div><div className="text-xs text-slate-400">{leave.employee?.department}</div></td>
                    <td className="px-5 py-4">{leave.leaveType}</td>
                    <td className="px-5 py-4">{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</td>
                    <td className="max-w-[220px] px-5 py-4 text-slate-500">{leave.reason || "—"}</td>
                    <td className="px-5 py-4"><StatusBadge status={leave.status} /></td>
                    <td className="px-5 py-4">
                      {leave.status === "Pending" ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => update(leave._id, "Approved")}><Check className="h-3.5 w-3.5" /> Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => update(leave._id, "Rejected")}><X className="h-3.5 w-3.5" /> Reject</Button>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="p-5"><EmptyState title="No leave requests" /></div>}
      </Card>
    </div>
  );
}

function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leaveType: "Casual", startDate: "", endDate: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try { setLeaves((await api.getLeaves()).data); } catch (e) { setError(e.message); }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.applyLeave(form);
      setOpen(false);
      setForm({ leaveType: "Casual", startDate: "", endDate: "", reason: "" });
      load();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Employee Portal"
        title="Leave Requests"
        description="Apply for leave and track your request history."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Apply for Leave</Button>}
      />

      {error && !open && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <Card className="overflow-hidden rounded-2xl">
        {leaves.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-white text-xs text-slate-500">
                <tr><th className="px-5 py-3">Leave Type</th><th className="px-5 py-3">Start</th><th className="px-5 py-3">End</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-5 py-4 font-semibold">{leave.leaveType}</td>
                    <td className="px-5 py-4">{formatDate(leave.startDate)}</td>
                    <td className="px-5 py-4">{formatDate(leave.endDate)}</td>
                    <td className="max-w-[300px] px-5 py-4 text-slate-500">{leave.reason || "—"}</td>
                    <td className="px-5 py-4"><StatusBadge status={leave.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="p-5"><EmptyState title="No leave history" description="Your submitted leave requests will appear here." /></div>}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Submit your leave request for HR approval.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Leave Type</label>
              <select className="h-10 w-full rounded-lg border bg-white px-3 text-sm" value={form.leaveType} onChange={(e) => set("leaveType", e.target.value)}>
                <option>Casual</option><option>Sick</option><option>Earned</option><option>Unpaid</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date"><Input required type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field>
              <Field label="End Date"><Input required type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} /></Field>
            </div>
            <Field label="Reason"><Textarea value={form.reason} onChange={(e) => set("reason", e.target.value)} placeholder="Reason for leave..." /></Field>
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <Button disabled={loading} className="w-full">{loading ? "Submitting..." : "Submit Leave Request"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  function set(key, value) { setForm((prev) => ({ ...prev, [key]: value })); }
}

function Field({ label, children }) {
  return <div><label className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
