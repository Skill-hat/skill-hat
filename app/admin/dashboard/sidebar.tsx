import { Link, useLocation } from "react-router";
import { MdDashboard, MdWork, MdSchool, MdPerson } from "react-icons/md";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    { path: "/internships", label: "Internships", icon: MdWork },
    { path: "/courses", label: "Courses", icon: MdSchool },
    { path: "/mentors", label: "Mentors", icon: MdPerson },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-blue-100 mt-1">Internships & Courses</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}