// src/app/companies/[companyId]/jobs/listing/components/FilterSection.jsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

export const FilterSection = ({
  filterVisible,
  toggleFilterSection,
  jobTypeFilters,
  setJobTypeFilters,
  salaryFilters,
  setSalaryFilters,
  locationFilter,
  setLocationFilter,
  keywordFilter,
  setKeywordFilter,
}) => {
  const handleJobTypeChange = (type) => {
    setJobTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSalaryChange = (range) => {
    setSalaryFilters((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    toggleFilterSection();
  };

  return (
    <section
      className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl p-6 transform transition-transform duration-300 z-10 ${
        filterVisible ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 lg:shadow-md lg:rounded-lg`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#3b82f6]" />
          <h3 className="text-lg font-semibold text-[#3b82f6]">Filters</h3>
        </div>
        <Button variant="ghost" className="lg:hidden text-gray-500" onClick={toggleFilterSection}>
          Close
        </Button>
      </div>
      <form onSubmit={handleFilterSubmit} className="space-y-6">
        <div>
          <Label className="block text-gray-700 font-medium mb-2">Job Type</Label>
          <div className="space-y-2">
            {['Full-Time', 'Part-Time', 'Contract'].map((type) => (
              <div key={type} className="flex items-center">
                <Checkbox
                  id={`job-type-${type}`}
                  checked={jobTypeFilters.includes(type)}
                  onCheckedChange={() => handleJobTypeChange(type)}
                  className="border-gray-300"
                />
                <Label htmlFor={`job-type-${type}`} className="ml-2 text-gray-600">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="block text-gray-700 font-medium mb-2">Salary Range</Label>
          <div className="space-y-2">
            {['30000-50000', '50001-70000', '70001+'].map((range) => (
              <div key={range} className="flex items-center">
                <Checkbox
                  id={`salary-${range}`}
                  checked={salaryFilters.includes(range)}
                  onCheckedChange={() => handleSalaryChange(range)}
                  className="border-gray-300"
                />
                <Label htmlFor={`salary-${range}`} className="ml-2 text-gray-600">
                  {range === '70001+' ? '$70,000+' : `$${range.split('-')[0]}-$${range.split('-')[1]}`}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </Label>
          <Input
            id="location"
            placeholder="City or Remote"
            className="w-full rounded-lg bg-gray-50 border-gray-200 p-2 focus:ring-[#3b82f6]"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="keywords" className="block text-gray-700 font-medium mb-2">
            Keywords
          </Label>
          <Input
            id="keywords"
            placeholder="e.g. Java, Marketing"
            className="w-full rounded-lg bg-gray-50 border-gray-200 p-2 focus:ring-[#3b82f6]"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#3b82f6] text-white rounded-lg py-2 hover:bg-[#2563eb] transition-all shadow-md"
        >
          Apply Filters
        </Button>
      </form>
    </section>
  );
};