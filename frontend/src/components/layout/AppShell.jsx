import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hrLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/employees",
      label: "Employees",
      icon: UsersRound,
    },
    {
      to: "/attendance",
      label: "Attendance",
      icon: ClipboardCheck,
    },
    {
      to: "/leaves",
      label: "Leave Requests",
      icon: FileText,
    },
  ];

  const employeeLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/my-attendance",
      label: "My Attendance",
      icon: ClipboardCheck,
    },
    {
      to: "/my-leaves",
      label: "Leave Requests",
      icon: FileText,
    },
    {
      to: "/profile",
      label: "My Profile",
      icon: UserRound,
    },
  ];

  const links = user?.role === "HR" ? hrLinks : employeeLinks;

  function signOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-hidden border-r border-slate-100 bg-white lg:block">
        <Sidebar user={user} links={links} onLogout={signOut} />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative h-full w-72 overflow-hidden bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />

              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <NavLinks
              links={links}
              close={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <div className="text-sm font-medium lg:hidden">
                  ZEEROSTOCK HRMS
                </div>

                <div className="hidden text-sm font-semibold text-slate-500 sm:block">
                  {user?.role === "HR"
                    ? "HR Portal"
                    : "Employee Portal"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium">
                  {user?.name}
                </div>

                <div className="text-xs text-slate-400">
                  {user?.role}
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="container-app py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ user, links, onLogout }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      
      {/* Logo */}
      <div className="relative z-20 px-5 pb-5 pt-5">
        <Logo />
      </div>

      {/* Navigation */}
      <div className="relative z-20">
        <NavLinks links={links} />
      </div>
     
{/* Bottom soft wave background */}
<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[480px] overflow-hidden">

  {/* First wave - light wave */}
  <div
    className="
      absolute
      -bottom-20
      -left-[180px]
      z-10
      h-[300px]
      w-[620px]
      rotate-[-8deg]
      rounded-[50%]
      bg-gradient-to-r
      from-blue-50
      via-indigo-50
      to-violet-100
    "
  />

  {/* Second wave - purple wave */}
  <div
    className="
      absolute
      -bottom-32
      -right-[220px]
      z-20
      h-[320px]
      w-[650px]
      rotate-[-28deg]
      rounded-[50%]
      bg-gradient-to-r
      from-indigo-100
      via-blue-100
      to-violet-200
    "
  />

</div>

      {/* User Card */}
      <div className="relative z-20 mt-auto p-4 -translate-y-7">
        <div
          className="
            rounded-xl
            border
            border-slate-100
            bg-white/95
            p-3
            shadow-[0_8px_30px_rgba(99,102,241,0.08)]
            backdrop-blur
          "
        >
          {/* User information */}
          <div className="flex items-center gap-3">
            
            {/* Avatar */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
                text-sm
                font-medium
                text-indigo-600
              "
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Name + email */}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                {user?.name}
              </div>

              <div className="mt-0.5 truncate text-[9px] text-slate-400">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-100" />

          {/* Logout */}
          <Button
            variant="ghost"
            className="
              h-9
              w-full
              justify-start
              gap-2
              px-2
              text-xs
              font-medium
              text-slate-600
              hover:bg-slate-50
              hover:text-slate-900
            "
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOGO
========================================================= */

function Logo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3"
    >
      {/* Z icon */}
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-base
          font-black
          text-white
          shadow-sm
        "
      >
        Z
      </div>

      {/* Brand */}
      <div>
        <div className="text-sm font-semibold tracking-tight text-slate-900">
          ZEEROSTOCK
        </div>

        <div className="mt-0.5 text-[8px] font-medium tracking-wide text-slate-400">
          HR MANAGEMENT
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function NavLinks({ links, close }) {
  return (
    <nav className="px-3 pt-6">
      
      {/* Workspace */}
      <div
        className="
          mb-3
          px-3
          text-[9px]
          font-medium
          uppercase
          tracking-[0.18em]
          text-slate-400
        "
      >
        Workspace
      </div>

      <div className="space-y-1.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={close}
            className={({ isActive }) =>
              `
              group
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                isActive
                  ? "bg-indigo-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
              `
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`
                    h-[17px]
                    w-[17px]
                    shrink-0
                    transition
                    ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  `}
                  strokeWidth={1.8}
                />

                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}