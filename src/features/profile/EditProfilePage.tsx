import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/features/auth/api/authApi';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { showToast } from '@/components/common/Toast';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  FileText,
  Upload,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.profile?.portfolio_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.profile?.linkedin_url || '');
  const [githubUrl, setGithubUrl] = useState(user?.profile?.github_url || '');

  const [skills, setSkills] = useState<string[]>(user?.profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('bio', bio);
      formData.append('portfolio_url', portfolioUrl);
      formData.append('linkedin_url', linkedinUrl);
      formData.append('github_url', githubUrl);

      // Append skills as JSON string or multi-keys
      skills.forEach((skill) => {
        formData.append('skills', skill);
      });

      if (profilePicFile) {
        formData.append('profile_picture', profilePicFile);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await authApi.updateProfile(formData);
      if (res.success) {
        await refreshUser();
        showToast('Profile updated successfully!', 'success');
        navigate('/profile');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/profile')}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
          <p className="text-xs text-slate-500">Update your details, technical skills and resume</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setProfilePicFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bio / Professional Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your background, core tech stack, and proudest accomplishments..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </Card>

        {/* Resume & Skills */}
        <Card className="p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Resume & Technical Skills
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default Resume (PDF, DOC, DOCX up to 5MB)
            </label>
            {user?.profile?.resume && (
              <p className="text-xs text-slate-500 mb-2">
                Current Resume:{' '}
                <a href={user.profile.resume} target="_blank" rel="noreferrer" className="text-primary underline">
                  View uploaded resume
                </a>
              </p>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Technical Skills
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add skill (e.g. React, Django, Docker)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-primary border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Links */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Web & Social Profiles
          </h2>

          <Input
            label="Portfolio Website"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://yourportfolio.dev"
            leftIcon={<Globe className="w-4 h-4" />}
          />

          <Input
            label="LinkedIn URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            leftIcon={<Linkedin className="w-4 h-4" />}
          />

          <Input
            label="GitHub URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            leftIcon={<Github className="w-4 h-4" />}
          />
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

