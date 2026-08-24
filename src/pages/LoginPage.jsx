import { useState } from "react";
import { Mail, LockKeyhole, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust import path

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Trim and format registration number (uppercase)
    const formattedRegNo = regNo.trim().toUpperCase();

    if (!formattedRegNo || !password) {
      setError("Please enter both registration number and password.");
      return;
    }

    const result = await login(formattedRegNo, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Invalid registration number or password.");
    }
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
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Registration Number"
              aria-label="Registration number"
              disabled={loading}
              className="min-w-0 flex-1 rounded-l-[5px] border border-[#ced4da] bg-[#e8f0fe] px-[14px] text-[16px] text-[#111] outline-none transition placeholder:text-[#6c757d] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] disabled:opacity-60"
            />
            <span className="flex w-[50px] items-center justify-center rounded-r-[5px] border border-l-0 border-[#ced4da] bg-[#e9ecef] text-[19px] text-[#45515c]">
              <Mail size={19} />
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
              disabled={loading}
              className="min-w-0 flex-1 rounded-l-[5px] border border-[#ced4da] bg-[#e8f0fe] px-[14px] text-[16px] text-[#111] outline-none transition placeholder:text-[#6c757d] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] disabled:opacity-60"
            />
            <span className="flex w-[50px] items-center justify-center rounded-r-[5px] border border-l-0 border-[#ced4da] bg-[#e9ecef] text-[19px] text-[#45515c]">
              <LockKeyhole size={19} />
            </span>
          </div>

          {/* Error message */}
          {(error || authError) && (
            <p className="mt-[12px] text-[15px] text-red-600">
              {error || authError}
            </p>
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
              disabled={loading}
              className="flex h-[46px] w-[116px] items-center justify-center gap-2 rounded-[5px] bg-[#007bff] text-[18px] text-white shadow-none transition hover:bg-[#0069d9] focus:outline-none focus:ring-2 focus:ring-[#80bdff] focus:ring-offset-1 active:bg-[#0062cc] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Signing...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
