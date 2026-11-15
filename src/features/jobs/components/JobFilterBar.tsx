import React, { useState, useEffect } from 'react';
import { JobFilterParams } from '@/types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface JobFilterBarProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  onReset: () => void;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({ filters, onChange, onReset }) => {
  const [search, setSearch] = useState(filters.search || '');
  const [location, setLocation] = useState(filters.location || '');
  const [skill, setSkill] = useState(filters.skill || '');

  const debouncedSearch = useDebounce(search, 350);
  const debouncedLocation = useDebounce(location, 350);
  const debouncedSkill = useDebounce(skill, 350);

  // Sync debounced inputs to parent filter state
  useEffect(() => {
    const hasSearchChanged = (debouncedSearch || undefined) !== (filters.search || undefined);
    const hasLocationChanged = (debouncedLocation || undefined) !== (filters.location || undefined);
    const hasSkillChanged = (debouncedSkill || undefined) !== (filters.skill || undefined);

    if (hasSearchChanged || hasLocationChanged || hasSkillChanged) {
      onChange({
        ...filters,
        search: debouncedSearch || undefined,
        location: debouncedLocation || undefined,
        skill: debouncedSkill || undefined,
        page: 1,
      });
    }
  }, [debouncedSearch, debouncedLocation, debouncedSkill]);

  // Sync external resets or changes to local input states
  useEffect(() => {
    if (!filters.search && search) setSearch('');
    if (!filters.location && location) setLocation('');
    if (!filters.skill && skill) setSkill('');
  }, [filters.search, filters.location, filters.skill]);

  const handleChange = (field: keyof JobFilterParams, value: any) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setSkill('');
    onReset();
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.location ||
      filters.job_type ||
      filters.work_mode ||
      filters.experience_level ||
      filters.salary_min ||
      filters.skill ||
      search ||
      location ||
      skill
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Top Search Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          placeholder="Job title, keywords, or company..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          placeholder="City, state, or remote..."
          leftIcon={<MapPin className="w-4 h-4" />}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          placeholder="Required skill (e.g. React, Python)..."
          leftIcon={<Filter className="w-4 h-4" />}
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>

      {/* Filter Selects Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Job Type</label>
          <select
            value={filters.job_type || ''}
            onChange={(e) => handleChange('job_type', e.target.value || undefined)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Job Types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Work Mode</label>
          <select
            value={filters.work_mode || ''}
            onChange={(e) => handleChange('work_mode', e.target.value || undefined)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Work Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Experience Level</label>
          <select
            value={filters.experience_level || ''}
            onChange={(e) => handleChange('experience_level', e.target.value || undefined)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Experience</option>
            <option value="ENTRY">Entry Level</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid Level</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead / Architect</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Min Salary ($)</label>
          <select
            value={filters.salary_min || ''}
            onChange={(e) => handleChange('salary_min', e.target.value || undefined)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Any Salary</option>
            <option value="50000">$50,000+</option>
            <option value="80000">$80,000+</option>
            <option value="100000">$100,000+</option>
            <option value="130000">$130,000+</option>
            <option value="160000">$160,000+</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-slate-500 text-xs">
            <X className="w-3.5 h-3.5" /> Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

