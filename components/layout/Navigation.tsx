"use client";

import { useAuth, useAuthActions } from '@/lib/store/authStore';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import NotificationBell from '@/components/notification/NotificationBell';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigationLinks = [
    { name: "Home", href: "/", roles: [] },
    ...(isAuthenticated
      ? [
          {
            name: "Profile",
            href: "/profile",
            roles: ["ROLE_CUSTOMER", "ROLE_EMPLOYEE", "ROLE_ADMIN"],
          },
          {
            name: "Notifications",
            href: "/notifications",
            roles: ["ROLE_CUSTOMER", "ROLE_EMPLOYEE", "ROLE_ADMIN"],
          },
          ...(user?.role === "ROLE_CUSTOMER"
            ? [
                {
                  name: "Dashboard",
                  href: "/customer",
                  roles: ["ROLE_CUSTOMER"],
                },
              ]
            : []),
          ...(user?.role === "ROLE_EMPLOYEE"
            ? [
                {
                  name: "Dashboard",
                  href: "/employee",
                  roles: ["ROLE_EMPLOYEE"],
                },
              ]
            : []),
          ...(user?.role === "ROLE_ADMIN"
            ? [
                {
                  name: "Dashboard",
                  href: "/admin",
                  roles: ["ROLE_ADMIN"],
                },
              ]
            : []),
        ]
      : []),
  ];

  const filteredLinks = navigationLinks.filter(
    (link) =>
      link.roles.length === 0 ||
      !isAuthenticated ||
      link.roles.includes(user?.role || ""),
  );

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and primary navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-blue-600">NexusAuto</span>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                    isActiveLink(link.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <NotificationBell />
                
                {/* User info */}
                <div className="hidden sm:flex sm:items-center sm:space-x-2">
                  <span className="text-sm text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {user.role.replace("ROLE_", "")}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {filteredLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block border-l-4 py-2 pr-4 pl-3 text-base font-medium transition-colors hover:bg-gray-50 ${
                isActiveLink(link.href)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}