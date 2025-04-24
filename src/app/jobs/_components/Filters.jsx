'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';
import { Spinner } from "@/components/ui/Spinner"; // Assuming you have a Spinner component
import { countryCodeMap } from './countryCodes';

export const Filters = ({
  options,
  onFilterChange,
  onReset,
  loading = false // Add loading prop
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    employment_types: [],
    experience_levels: [],
    locations: [],
    salary_ranges: []
  });

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('jobFilters');
    if (savedFilters) {
      setSelectedFilters(JSON.parse(savedFilters));
    }
  }, []);

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(v => v !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      localStorage.setItem('jobFilters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const handleApply = () => {
    localStorage.setItem('jobFilters', JSON.stringify(selectedFilters));
    onFilterChange(selectedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      employment_types: [],
      experience_levels: [],
      locations: [],
      salary_ranges: []
    };
    setSelectedFilters(resetFilters);
    localStorage.removeItem('jobFilters');
    onReset();
  };

  // Function to format location label
  const formatLocationLabel = (locationValue) => {
    // Check if it's a country code (2 letters)
    if (/^[A-Z]{2}$/.test(locationValue)) {
      return countryCodeMap[locationValue] || locationValue;
    }
    return locationValue;
  };

  return (
    <Card className="space-y-6 p-4">
      <h3 className="font-semibold">Filters</h3>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          {/* Employment Types */}
          {options.employment_types.length > 0 && (
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <div className="space-y-2">
                {options.employment_types.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`emp-type-${type.value}`}
                      checked={selectedFilters.employment_types.includes(type.value)}
                      onCheckedChange={() => handleCheckboxChange('employment_types', type.value)}
                    />
                    <Label htmlFor={`emp-type-${type.value}`}>
                      {type.label} ({type.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Levels */}
          {options.experience_levels.length > 0 && (
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <div className="space-y-2">
                {options.experience_levels.map(level => (
                  <div key={level.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`exp-level-${level.value}`}
                      checked={selectedFilters.experience_levels.includes(level.value)}
                      onCheckedChange={() => handleCheckboxChange('experience_levels', level.value)}
                    />
                    <Label htmlFor={`exp-level-${level.value}`}>
                      {level.label} ({level.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {options.locations.length > 0 && (
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="space-y-2">
                {options.locations.map(location => (
                  <div key={location.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`location-${location.value}`}
                      checked={selectedFilters.locations.includes(location.value)}
                      onCheckedChange={() => handleCheckboxChange('locations', location.value)}
                    />
                    <Label htmlFor={`location-${location.value}`}>
                      {formatLocationLabel(location.label)} ({location.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Ranges */}
          {options.salary_ranges.length > 0 && (
            <div className="space-y-2">
              <Label>Salary Range</Label>
              <div className="space-y-2">
                {options.salary_ranges.map(range => (
                  <div key={range.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`salary-${range.value}`}
                      checked={selectedFilters.salary_ranges.includes(range.value)}
                      onCheckedChange={() => handleCheckboxChange('salary_ranges', range.value)}
                    />
                    <Label htmlFor={`salary-${range.value}`}>
                      {range.label} ({range.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-brand text-white hover:bg-brand/70 hover:text-white"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              className="flex-1 border border-brand text-brand hover:border-brand hover:text-brand"
              onClick={handleApply}
              disabled={loading}
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};