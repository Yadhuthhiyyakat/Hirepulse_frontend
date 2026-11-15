import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../api/companiesApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { showToast } from '@/components/common/Toast';
import { Building2, Globe, MapPin, Users, Calendar, Upload } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-company'],
    queryFn: companiesApi.getMyCompany,
    retry: false,
  });

  const company = data?.data;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('51-200');
  const [foundedYear, setFoundedYear] = useState<number | string>('2020');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setDescription(company.description || '');
      setWebsite(company.website || '');
      setIndustry(company.industry || '');
      setLocation(company.location || '');
      setCompanySize(company.company_size || '51-200');
      setFoundedYear(company.founded_year || '');
    }
  }, [company]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      setFieldErrors({});
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      let formattedWebsite = website.trim();
      if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }
      formData.append('website', formattedWebsite);

      formData.append('industry', industry);
      formData.append('location', location);
      formData.append('company_size', companySize);
      if (foundedYear) formData.append('founded_year', String(foundedYear));
      if (logoFile) formData.append('logo', logoFile);

      if (company?.id) {
        return companiesApi.updateCompany(company.id, formData);
      } else {
        return companiesApi.createCompany(formData);
      }
    },
    onSuccess: () => {
      setFieldErrors({});
      showToast('Company profile saved successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
    },
    onError: (err: any) => {
      const errRes = err.response?.data;
      if (errRes?.errors) {
        const errorsMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(errRes.errors)) {
          errorsMap[key] = Array.isArray(val) ? val.join(' ') : String(val);
        }
        setFieldErrors(errorsMap);
        const firstErrorMessage = Object.values(errorsMap)[0];
        showToast(firstErrorMessage || errRes.message || 'Validation failed.', 'error');
      } else {
        showToast(errRes?.message || 'Failed to save company profile.', 'error');
      }
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Company Profile & Branding
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This profile will be displayed on all your job postings and company pages.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                placeholder="e.g. Acme Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
                required
              />

              <Input
                label="Industry / Domain *"
                placeholder="e.g. Artificial Intelligence, FinTech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                error={fieldErrors.industry}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="HQ Location"
                placeholder="e.g. San Francisco, CA"
                leftIcon={<MapPin className="w-4 h-4" />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={fieldErrors.location}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1-10">1-10 employees (Startup)</option>
                  <option value="11-50">11-50 employees (Early Stage)</option>
                  <option value="51-200">51-200 employees (Growth)</option>
                  <option value="201-500">201-500 employees (Scaleup)</option>
                  <option value="500+">500+ employees (Enterprise)</option>
                </select>
              </div>

              <Input
                label="Founded Year"
                type="number"
                placeholder="e.g. 2018"
                leftIcon={<Calendar className="w-4 h-4" />}
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                error={fieldErrors.founded_year}
              />
            </div>

            <Input
              label="Company Website"
              placeholder="https://company.com"
              leftIcon={<Globe className="w-4 h-4" />}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              error={fieldErrors.website}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Logo
              </label>
              {company?.logo && (
                <div className="mb-3 flex items-center gap-3">
                  <img src={company.logo} alt="Company logo" className="h-12 w-12 rounded-lg object-cover border" />
                  <span className="text-xs text-slate-500">Current logo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                About the Company
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your company culture, mission, technical stack and vision..."
                className={`w-full rounded-lg border p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.description}</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" isLoading={saveMutation.isPending}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

