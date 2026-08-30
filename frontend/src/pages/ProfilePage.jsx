import { useEffect, useState } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeading, formatDate } from "./DashboardPage";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({ name: res.data.name || "", phone: res.data.phone || "" });
      })
      .catch((e) => setError(e.message));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await api.updateProfile(form);
      setProfile(res.data);
      localStorage.setItem("hrms_user", JSON.stringify(res.data));
      setMessage("Profile updated successfully.");
    } catch (e) { setError(e.message); }
  }

  async function changePassword(e) {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await api.changePassword(password);
      setPassword({ currentPassword: "", newPassword: "" });
      setMessage(res.message);
    } catch (e) { setError(e.message); }
  }

  if (!profile) return <div className="py-20 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="space-y-7">
      <PageHeading eyebrow="Employee Portal" title="My Profile" description="View and edit your basic personal information." />

      {message && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-medium text-blue-700">{profile.name?.charAt(0)}</div>
            <div>
              <div className="text-lg font-medium">{profile.name}</div>
              <div className="text-sm text-slate-500">{profile.designation} · {profile.department}</div>
            </div>
          </div>

          <Separator className="my-6" />

          <form onSubmit={saveProfile} className="space-y-5">
            <Field label="Full Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
            <Field label="Email"><Input value={profile.email} disabled /></Field>
            <Field label="Phone Number"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Department" value={profile.department} />
              <Info label="Designation" value={profile.designation} />
              <Info label="Date of Joining" value={formatDate(profile.dateOfJoining)} />
              <Info label="Role" value={profile.role} />
            </div>

            <Button><Save className="h-4 w-4" /> Save Changes</Button>
          </form>
        </Card>

        <Card className="h-fit rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><KeyRound className="h-5 w-5" /></div>
            <div><div className="font-medium">Change Password</div><div className="text-xs text-slate-500">Keep your account secure.</div></div>
          </div>

          <form onSubmit={changePassword} className="mt-6 space-y-4">
            <Field label="Current Password"><Input type="password" required value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} /></Field>
            <Field label="New Password"><Input type="password" required minLength="6" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></Field>
            <Button className="w-full">Update Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );

  function set(key, value) { setForm((prev) => ({ ...prev, [key]: value })); }
}

function Field({ label, children }) {
  return <div><label className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}

function Info({ label, value }) {
  return <div className="rounded-xl bg-white p-4"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 text-sm font-medium">{value || "—"}</div></div>;
}
