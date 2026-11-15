import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  FileText,
  Briefcase,
  GraduationCap,
  Edit3
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Profile Summary */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary font-bold text-2xl border-2 border-white shadow-md overflow-hidden">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.full_name} className="h-full w-full object-cover" />
              ) : (
                user?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{user?.full_name}</h1>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {user?.role?.replace('_', ' ')}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </span>
                )}
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Link to="/profile/edit">
              <Button size="sm" variant="outline" className="gap-1.5 shadow-sm">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Social & Portfolio Links */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
          {profile?.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Download Resume
            </a>
          )}
          {profile?.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Portfolio Website
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
            </a>
          )}
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub
            </a>
          )}
        </div>
      </Card>

      {/* Bio / Summary */}
      {profile?.bio && (
        <Card className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </Card>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 border border-slate-200/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Experience Section */}
      {profile?.experience && profile.experience.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Work Experience
          </h2>
          <div className="space-y-4 divide-y divide-slate-100">
            {profile.experience.map((exp, i) => (
              <div key={i} className={i > 0 ? 'pt-4' : ''}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Education Section */}
      {profile?.education && profile.education.length > 0 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Education & Certifications
          </h2>
          <div className="space-y-4 divide-y divide-slate-100">
            {profile.education.map((edu, i) => (
              <div key={i} className={i > 0 ? 'pt-4' : ''}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.institution}</h3>
                    <p className="text-xs text-slate-600">
                      {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {edu.start_year} - {edu.end_year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

