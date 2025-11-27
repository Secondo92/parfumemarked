import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, PlusCircle, UserCircle, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import type { User } from "firebase/auth";
import type { ChatThread } from "../../types";

interface HeaderProps {
  user: User | null;
  profile: { username: string } | null;
  threads: ChatThread[];
}

const Header: React.FC<HeaderProps> = ({ user, profile, threads }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b mb-6">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        DuftBasen
      </Link>

      <nav className="flex items-center space-x-6">
        {user ? (
          <>
            <button
              onClick={() => navigate("/create-sale")}
              className="text-sm font-semibold flex items-center gap-1"
            >
              <PlusCircle size={18} /> Opret opslag
            </button>

            <button
              onClick={() => navigate("/inbox")}
              className="relative text-sm font-semibold flex items-center gap-1"
            >
              <Mail size={18} />
              Indbakke
              {threads.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-[1px] rounded-full">
                  {threads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="text-sm font-semibold flex items-center gap-1"
            >
              <UserCircle size={18} />
              {profile?.username ?? "Profil"}
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
            >
              <LogOut size={18} />
              Log ud
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold"
          >
            Log ind
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
