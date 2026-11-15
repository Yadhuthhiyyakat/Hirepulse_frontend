import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companiesApi } from '../api/companiesApi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Users, Globe } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export const CompaniesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies', debouncedSearch, page],
    queryFn: () => companiesApi.getCompanies({ search: debouncedSearch, page }),
  });

  const paginatedData = data?.data;
  const companies = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore Tech Companies
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Learn about engineering cultures, open positions, and company visions.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search company by name or industry..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load companies" description="Failed to fetch companies from the backend." />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-6 h-6 text-slate-400" />}
          title="No companies found"
          description="Try searching with another company name or industry keyword."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => (
              <Card key={c.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border overflow-hidden">
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/companies/${c.id}`}
                        className="text-base font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                      >
                        {c.name}
                      </Link>
                      <span className="text-xs text-primary font-medium">{c.industry || 'Tech'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description || 'Modern tech company committed to engineering excellence.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location || 'Global'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {c.company_size || '50+'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {c.jobs_count || 0} Open Roles
                  </span>
                  <Link to={`/companies/${c.id}`} className="font-medium text-primary hover:underline">
                    View Profile &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {paginatedData && (
            <Pagination
              currentPage={paginatedData.current_page}
              totalPages={paginatedData.total_pages}
              hasNext={paginatedData.has_next}
              hasPrevious={paginatedData.has_previous}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      )}
    </div>
  );
};

