import React from 'react';
import { Briefcase, Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Hire<span className="text-primary">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Modern recruitment management ecosystem connecting top engineering and product talent with world-class teams.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">For Candidates</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors">Companies</Link></li>
              <li><Link to="/applications" className="hover:text-primary transition-colors">Track Applications</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Candidate Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">For Employers</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/recruiter/dashboard" className="hover:text-primary transition-colors">Recruiter Dashboard</Link></li>
              <li><Link to="/recruiter/jobs/create" className="hover:text-primary transition-colors">Post an Opening</Link></li>
              <li><Link to="/recruiter/applicants" className="hover:text-primary transition-colors">Candidate Pipeline</Link></li>
              <li><Link to="/recruiter/company" className="hover:text-primary transition-colors">Company Brand</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Platform & API</h4>
            <p className="mt-3 text-xs text-slate-500">
              Built with React, TypeScript, TanStack Query, Tailwind CSS, Django REST Framework, SimpleJWT & Channels.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="http://localhost:8000/api/docs/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                Swagger API Docs &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} HirePulse Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Production Full-Stack Architecture Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

