import { useState } from "react";
import { Mail, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Pre-determined login credentials
  const CORRECT_EMAIL = "vug/csc/23/9680@nas.veritas.edu.ng";
  const CORRECT_PASSWORD = "Hezekiah1234";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Check credentials
    if (
      email.trim().toLowerCase() === CORRECT_EMAIL.toLowerCase() &&
      password === CORRECT_PASSWORD
    ) {
      // Login successful
      navigate("/dashboard");
      return;
    }

    // Login failed
    setError("Invalid registration number or password.");
  };

  return (
    <main className="min-h-screen bg-[#e9ecef] flex items-center justify-center px-4 font-['Segoe_UI',_Roboto,_Arial,_sans-serif]">
      <div className="w-full max-w-[433px] overflow-hidden rounded-[5px] border border-[#ced4da] border-t-[3px] border-t-[#007bff] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.18)]">
        {/* Header */}
        <header className="flex h-[106px] items-center justify-center border-b border-[#dee2e6] px-5 text-center">
          <h1 className="m-0 text-[27px] font-normal leading-[1.2] text-[#111827]">
            <span className="font-bold">Veritas University</span>{" "}
            <span>eCampus::</span>
            <br />
            <span>Students Login</span>
          </h1>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-[24px] pb-[23px] pt-[25px]">
          {/* Registration Number */}
          <div className="flex h-[46px]">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registration Number"
              aria-label="Registration number"
              className="min-w-0 flex-1 rounded-l-[5px] border border-[#ced4da] bg-[#e8f0fe] px-[14px] text-[16px] text-[#111] outline-none transition placeholder:text-[#6c757d] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
            />

            <span className="flex w-[50px] items-center justify-center rounded-r-[5px] border border-l-0 border-[#ced4da] bg-[#e9ecef] text-[19px] text-[#45515c]">
              <Mail />
            </span>
          </div>

          {/* Password */}
          <div className="mt-[18px] flex h-[46px]">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className="min-w-0 flex-1 rounded-l-[5px] border border-[#ced4da] bg-[#e8f0fe] px-[14px] text-[16px] text-[#111] outline-none transition placeholder:text-[#6c757d] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
            />

            <span className="flex w-[50px] items-center justify-center rounded-r-[5px] border border-l-0 border-[#ced4da] bg-[#e9ecef] text-[19px] text-[#45515c]">
              <LockKeyhole />
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-[12px] text-[15px] text-red-600">{error}</p>
          )}

          {/* Bottom row */}
          <div className="mt-[18px] flex items-center justify-between">
            <a
              href="#forgot-password"
              onClick={(e) => e.preventDefault()}
              className="text-[18px] italic text-[#007bff] no-underline hover:underline"
            >
              I forgot my password
            </a>

            <button
              type="submit"
              className="h-[46px] w-[116px] rounded-[5px] bg-[#007bff] text-[18px] text-white shadow-none transition hover:bg-[#0069d9] focus:outline-none focus:ring-2 focus:ring-[#80bdff] focus:ring-offset-1 active:bg-[#0062cc]"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
