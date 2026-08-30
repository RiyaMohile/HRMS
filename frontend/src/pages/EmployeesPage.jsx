import { useEffect, useState } from "react";
import { Pencil, Plus, Search, UsersRound } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeading, formatDate } from "./DashboardPage";
import EmptyState from "@/components/shared/EmptyState";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  dateOfJoining: ""
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.getEmployees({ search });
      setEmployees(res.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function searchEmployees(e) {
    e.preventDefault();
    load();
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(employee) {
    setEditing(employee);
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      dateOfJoining: employee.dateOfJoining ? employee.dateOfJoining.slice(0, 10) : ""
    });
    setError("");
    setDialogOpen(true);
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editing) {
        await api.updateEmployee(editing._id, form);
      } else {
        await api.createEmployee(form);
      }
      setDialogOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="HR Portal"
        title="Employee Management"
        description="Add, edit, search and manage employee information."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Employee</Button>}
      />

      <Card className="rounded-2xl p-4">
        <form onSubmit={searchEmployees} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, department or designation..." className="pl-9" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {error && !dialogOpen && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <Card className="overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b p-5">
          <UsersRound className="h-5 w-5 text-blue-600" />
          <div className="font-medium">Employees</div>
          <span className="text-xs text-slate-400">({employees.length})</span>
        </div>

        {employees.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-white text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Designation</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Joining Date</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-white/70">
                    <td className="px-5 py-4">
                      <div className="font-medium">{employee.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{employee.email}</div>
                    </td>
                    <td className="px-5 py-4">{employee.department}</td>
                    <td className="px-5 py-4">{employee.designation}</td>
                    <td className="px-5 py-4">{employee.phone || "—"}</td>
                    <td className="px-5 py-4">{formatDate(employee.dateOfJoining)}</td>
                    <td className="px-5 py-4">
                      <Button variant="outline" size="sm" onClick={() => openEdit(employee)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="p-5"><EmptyState title="No employees found" description="Try a different search or add a new employee." /></div>}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle>
            <DialogDescription>Enter the employee's basic HR information.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Email"><Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Phone Number"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Department"><Input required value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Engineering" /></Field>
              <Field label="Designation"><Input required value={form.designation} onChange={(e) => set("designation", e.target.value)} placeholder="Software Developer" /></Field>
              <Field label="Date of Joining"><Input required type="date" value={form.dateOfJoining} onChange={(e) => set("dateOfJoining", e.target.value)} /></Field>
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <Button disabled={loading} className="w-full">{loading ? "Saving..." : editing ? "Update Employee" : "Add Employee"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
}

function Field({ label, children }) {
  return <div><label className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
