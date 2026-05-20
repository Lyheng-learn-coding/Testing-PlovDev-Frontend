import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import { logOut } from "../auth/services/auth.service";
import Swal from "sweetalert2";

const NAV_LINKS = [
  { label: "Home", to: "/homepage" },
  { label: "Courses", to: "/coursepage" },
  { label: "About Us", to: "/about" },
  { label: "Job Board", to: "/jobs" },
  { label: "Dashboard", to: "/dashboardpage" },
];

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const logout = async () => {
    await logOut();
    setAccessToken(null);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#111111] px-16 h-16 flex items-center justify-between font-sans opacity-100 ">
        {/* Left: Nav Links */}
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[#cccccc] text-sm hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <div className="flex gap-5">
            <Link className="text-[#cccccc] " to="/teacher/create-course">
              Instructors
            </Link>
            <Link className="text-[#cccccc] " to="/student">
              My Learning
            </Link>
          </div>
          {/* Right: Search + Auth */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#222222] border border-[#333333] rounded-md px-3 py-1.5 w-52">
              <svg
                className="w-4 h-4 text-[#666666] shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="bg-transparent border-none outline-none text-[#aaaaaa] placeholder-[#555555] text-sm w-full"
              />
            </div>

            {/* Sign In */}
            {accessToken ? (
              <button
                onClick={handleLogOut}
                className="bg-[#00d4c8] hover:opacity-85 text-black text-sm font-medium px-4 py-2 rounded-md transition-opacity duration-200"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate("/authpage")}
                className="bg-[#00d4c8] hover:opacity-85 text-black text-sm font-medium px-4 py-2 rounded-md transition-opacity duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
