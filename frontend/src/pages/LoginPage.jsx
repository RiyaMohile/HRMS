import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("hr@zeerostock.com");
  const [password, setPassword] = useState("Hr@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.login({
        email,
        password,
      });

      login(response.data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8faff]">

      {/* =====================================================
          SOFT BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[80px]
          h-[650px]
          w-[650px]
          rounded-full
          bg-blue-100/50
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-300px]
          left-[15%]
          h-[550px]
          w-[1000px]
          rounded-full
          bg-indigo-100/50
          blur-3xl
        "
      />

      {/* =====================================================
          BOTTOM WAVE
      ====================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[190px] overflow-hidden">

        <div
          className="
            absolute
            -bottom-[120px]
            -left-[100px]
            h-[250px]
            w-[850px]
            rotate-[-7deg]
            rounded-[50%]
            bg-gradient-to-r
            from-blue-50
            via-indigo-50
            to-blue-100
          "
        />

        <div
          className="
            absolute
            -bottom-[150px]
            left-[350px]
            h-[260px]
            w-[850px]
            rotate-[-5deg]
            rounded-[50%]
            bg-gradient-to-r
            from-indigo-50
            via-blue-50
            to-violet-100
          "
        />

      </div>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative z-10 min-h-screen">

        {/* =================================================
            LOGO
        ================================================== */}

        <header className="px-10 pt-7 lg:px-16 lg:pt-8">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-2xl
                font-black
                text-white
                shadow-lg
                shadow-blue-100
              "
            >
              Z
            </div>

            <div>

              <div
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-[#102052]
                "
              >
                ZEEROSTOCK
              </div>

              <div
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  tracking-[0.08em]
                  text-[#7180a5]
                "
              >
                HR MANAGEMENT SYSTEM
              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            MAIN
        ================================================== */}

        <main
          className="
            mx-auto
            grid
            min-h-[calc(100vh-105px)]
            max-w-[1500px]
            items-center
            px-10
            pb-8
            lg:grid-cols-[38%_62%]
            lg:px-16
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <section
            className="
              relative
              z-20
              max-w-[560px]
              pb-5
            "
          >

            {/* Heading */}

            <h1
              className="
                text-[54px]
                font-medium
                leading-[1.02]
                tracking-tight
                text-[#101d48]
                xl:text-[62px]
              "
            >
              People first.
              <br />

              <span className="text-blue-600">
                Work smarter.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-7
                max-w-[510px]
                text-[16px]
                font-medium
                leading-7
                text-[#617292]
              "
            >
              A simple HRMS workspace for employee management,
              attendance and leave workflows.
            </p>

           

            {/* Secure */}

            <div className="mt-11 flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                "
              >
                <ShieldCheck
                  className="h-5 w-5 text-blue-600"
                />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-[#586a91]
                "
              >
                Secure role-based access
              </span>

            </div>

          </section>

          {/* =================================================
              RIGHT AREA
          ================================================== */}

          <section
            className="
              relative
              h-[600px]
              w-full
            "
          >

            {/* =================================================
                ILLUSTRATION BACKGROUND
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-[-16%]
                top-[5%]
                h-[520px]
                w-[700px]
                rounded-[48%]
                bg-gradient-to-br
                from-blue-100/90
                via-indigo-50
                to-blue-50/20
              "
            />

            {/* =================================================
                ILLUSTRATION
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-[-8%]
                top-1/2
                z-10
                w-[650px]
                -translate-y-1/2
                xl:left-[-20%]
                xl:w-[710px]
              "
            >
              <img
                src="/hrms-illustration.png"
                alt="HR management illustration"
                className="
                  block
                  h-auto
                  w-full
                  object-contain
                  drop-shadow-[0_25px_50px_rgba(37,99,235,0.10)]
                "
              />
            </div>

            {/* =================================================
                LOGIN CARD
            ================================================== */}

            <div
              id="login-form"
              className="
                absolute
                right-[0]
                top-1/2
                z-30
                w-[340px]
                -translate-y-1/2
                xl:w-[360px]
              "
            >
              <LoginCard
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                error={error}
                submit={submit}
              />
            </div>

          </section>

        </main>

      </div>
    </div>
  );
}

/* ============================================================
   LOGIN CARD
============================================================ */

function LoginCard({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  submit,
}) {
  return (
    <Card
      className="
        w-full
        rounded-[22px]
        border
        border-blue-100
        bg-white
        p-7
        shadow-[0_20px_60px_rgba(37,99,235,0.12)]
      "
    >

      {/* Heading */}

      <div>

        <h2
          className="
            text-[28px]
            font-medium
            tracking-tight
            text-[#162143]
          "
        >
          Welcome back
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[#687895]
          "
        >
          Sign in to access your HRMS workspace.
        </p>

      </div>

      {/* Form */}

      <form
        onSubmit={submit}
        className="mt-6 space-y-5"
      >

        {/* Email */}

        <Field label="Email">

          <div className="relative">

            <Mail
              className="
                absolute
                left-4
                top-3.5
                h-4
                w-4
                text-slate-400
              "
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="
                h-12
                rounded-xl
                border-slate-200
                pl-11
                text-sm
              "
            />

          </div>

        </Field>

        {/* Password */}

        <Field label="Password">

          <div className="relative">

            <LockKeyhole
              className="
                absolute
                left-4
                top-3.5
                h-4
                w-4
                text-slate-400
              "
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="
                h-12
                rounded-xl
                border-slate-200
                pl-11
                pr-11
                text-sm
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              className="
                absolute
                right-4
                top-3.5
                text-slate-400
              "
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

          </div>

        </Field>

        {/* Error */}

        {error && (
          <div
            className="
              rounded-xl
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* Sign In */}

        <Button
          type="submit"
          disabled={loading}
          className="
            h-12
            w-full
            rounded-xl
            bg-blue-600
            text-sm
            font-bold
            shadow-md
            shadow-blue-100
            hover:bg-blue-700
          "
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

      </form>

      {/* Demo accounts */}

      <div
        className="
          mt-5
          rounded-xl
          bg-[#f2f6ff]
          p-4
          text-[11px]
          leading-5
          text-[#687895]
        "
      >

        <div className="font-bold text-[#33415f]">
          Demo accounts
        </div>

        <div className="mt-1.5">
          HR: hr@zeerostock.com / Hr@12345
        </div>

        <div>
          Employee: employee@zeerostock.com / Emp@12345
        </div>

      </div>

    </Card>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({ label, children }) {
  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-[#18233d]
        "
      >
        {label}
      </label>

      {children}

    </div>
  );
}