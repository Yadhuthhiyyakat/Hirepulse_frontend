import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Public Pages (Lazy Loaded)
const LandingPage = lazy(() => import('@/features/jobs/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const JobsPage = lazy(() => import('@/features/jobs/pages/JobsPage').then(m => ({ default: m.JobsPage })));
const JobDetailsPage = lazy(() => import('@/features/jobs/pages/JobDetailsPage').then(m => ({ default: m.JobDetailsPage })));
const CompaniesPage = lazy(() => import('@/features/companies/pages/CompaniesPage').then(m => ({ default: m.CompaniesPage })));
const CompanyDetailsPage = lazy(() => import('@/features/companies/pages/CompanyDetailsPage').then(m => ({ default: m.CompanyDetailsPage })));

// Job Seeker Pages (Lazy Loaded)
const JobSeekerDashboard = lazy(() => import('@/features/applications/pages/JobSeekerDashboard').then(m => ({ default: m.JobSeekerDashboard })));
const MyApplicationsPage = lazy(() => import('@/features/applications/pages/MyApplicationsPage').then(m => ({ default: m.MyApplicationsPage })));
const SavedJobsPage = lazy(() => import('@/features/jobs/pages/SavedJobsPage').then(m => ({ default: m.SavedJobsPage })));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const EditProfilePage = lazy(() => import('@/features/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

// Recruiter Pages (Lazy Loaded)
const RecruiterDashboard = lazy(() => import('@/features/recruiter/pages/RecruiterDashboard').then(m => ({ default: m.RecruiterDashboard })));
const CompanyProfilePage = lazy(() => import('@/features/companies/pages/CompanyProfilePage').then(m => ({ default: m.CompanyProfilePage })));
const RecruiterJobsPage = lazy(() => import('@/features/recruiter/pages/RecruiterJobsPage').then(m => ({ default: m.RecruiterJobsPage })));
const CreateJobPage = lazy(() => import('@/features/jobs/pages/CreateJobPage').then(m => ({ default: m.CreateJobPage })));
const EditJobPage = lazy(() => import('@/features/jobs/pages/EditJobPage').then(m => ({ default: m.EditJobPage })));
const ApplicantsPage = lazy(() => import('@/features/recruiter/pages/ApplicantsPage').then(m => ({ default: m.ApplicantsPage })));
const ApplicantDetailsPage = lazy(() => import('@/features/recruiter/pages/ApplicantDetailsPage').then(m => ({ default: m.ApplicantDetailsPage })));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UsersPage = lazy(() => import('@/features/admin/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const JobsManagementPage = lazy(() => import('@/features/admin/pages/JobsManagementPage').then(m => ({ default: m.JobsManagementPage })));
const ApplicationsManagementPage = lazy(() => import('@/features/admin/pages/ApplicationsManagementPage').then(m => ({ default: m.ApplicationsManagementPage })));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // Public Routes
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/jobs', element: <JobsPage /> },
      { path: '/jobs/:id', element: <JobDetailsPage /> },
      { path: '/companies', element: <CompaniesPage /> },
      { path: '/companies/:id', element: <CompanyDetailsPage /> },

      // Protected: Authenticated User (Job Seeker / General)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/edit', element: <EditProfilePage /> },

          // Job Seeker Only
          {
            element: <RoleRoute allowedRoles={['JOB_SEEKER']} />,
            children: [
              { path: '/dashboard', element: <JobSeekerDashboard /> },
              { path: '/applications', element: <MyApplicationsPage /> },
              { path: '/saved-jobs', element: <SavedJobsPage /> },
            ],
          },

          // Recruiter Only
          {
            path: '/recruiter',
            element: <RoleRoute allowedRoles={['RECRUITER', 'ADMIN']} />,
            children: [
              { path: 'dashboard', element: <RecruiterDashboard /> },
              { path: 'company', element: <CompanyProfilePage /> },
              { path: 'jobs', element: <RecruiterJobsPage /> },
              { path: 'jobs/create', element: <CreateJobPage /> },
              { path: 'jobs/:id/edit', element: <EditJobPage /> },
              { path: 'applicants', element: <ApplicantsPage /> },
              { path: 'applicants/:id', element: <ApplicantDetailsPage /> },
              { path: 'notifications', element: <NotificationsPage /> },
            ],
          },

          // Admin Only
          {
            path: '/admin',
            element: <RoleRoute allowedRoles={['ADMIN']} />,
            children: [
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'jobs', element: <JobsManagementPage /> },
              { path: 'companies', element: <CompaniesPage /> },
              { path: 'applications', element: <ApplicationsManagementPage /> },
            ],
          },
        ],
      },

      // Fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

