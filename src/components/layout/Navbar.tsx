import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { Button } from '@/components/common/Button';
import {
  Briefcase,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  Building2,
  FileText,
  Bookmark
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Hire<span className="text-primary">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/jobs"
            className={`text-sm font-medium transition-colors ${
              isActive('/jobs') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Jobs
          </Link>
          <Link
            to="/companies"
            className={`text-sm font-medium transition-colors ${
              isActive('/companies') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Companies
          </Link>

          {isAuthenticated && user?.role === 'JOB_SEEKER' && (
            <>
              <Link
                to="/applications"
                className={`text-sm font-medium transition-colors ${
                  isActive('/applications') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Applications
              </Link>
              <Link
                to="/saved-jobs"
                className={`text-sm font-medium transition-colors ${
                  isActive('/saved-jobs') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Saved Jobs
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'RECRUITER' && (
            <>
              <Link
                to="/recruiter/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/recruiter/dashboard') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/jobs"
                className={`text-sm font-medium transition-colors ${
                  isActive('/recruiter/jobs') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manage Jobs
              </Link>
              <Link
                to="/recruiter/applicants"
                className={`text-sm font-medium transition-colors ${
                  isActive('/recruiter/applicants') ? 'text-primary font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Applicants
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/admin/dashboard') ? 'text-primary font-semibold' : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </Link>
          )}
        </nav>

        {/* User Right Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === 'RECRUITER' && (
                <Link to="/recruiter/jobs/create">
                  <Button size="sm" className="gap-1.5 shadow-sm">
                    <PlusCircle className="w-4 h-4" /> Post a Job
                  </Button>
                </Link>
              )}

              <NotificationDropdown />

              <div className="h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-3">
                <Link
                  to={user?.role === 'JOB_SEEKER' ? '/profile' : user?.role === 'RECRUITER' ? '/recruiter/company' : '/admin/dashboard'}
                  className="flex items-center gap-2 group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 group-hover:border-primary transition-colors overflow-hidden">
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt={user.full_name} className="h-full w-full object-cover" />
                    ) : (
                      user?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                    </p>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user?.role?.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Explore Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Companies
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'JOB_SEEKER' && (
                <>
                  <Link
                    to="/applications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/saved-jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Saved Jobs
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Profile
                  </Link>
                </>
              )}

              {user?.role === 'RECRUITER' && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Manage Jobs
                  </Link>
                  <Link
                    to="/recruiter/applicants"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Applicants
                  </Link>
                  <Link
                    to="/recruiter/jobs/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-primary font-semibold"
                  >
                    + Post a Job
                  </Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-purple-600"
                >
                  Admin Console
                </Link>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{user?.email}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

