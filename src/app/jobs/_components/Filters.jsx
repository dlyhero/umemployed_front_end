import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Spinner } from "@/components/ui/Spinner";
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { countryCodeMap } from './countryCodes';

export const Filters = ({
  loading = false,
  isMobile = false,
  isOpen = false,
  onClose,
  options = {},
  onFilterChange = () => {},
  onReset = () => {}
}) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    employment_types: true,
    experience_levels: true,
    salary_ranges: true,
    category: false,
    tags: false
  });

  const [selectedValues, setSelectedValues] = useState({
    location: options.locations?.[0]?.value || '',
    employment_types: [],
    experience_levels: [],
    salary_ranges: { min: 0, max: 3500, duration: 'monthly' },
    category: [],
    tags: []
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLocationChange = (location) => {
    const newValues = {
      ...selectedValues,
      location
    };
    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  const handleCheckboxChange = (category, value) => {
    const newValues = { ...selectedValues };
    if (newValues[category].includes(value)) {
      newValues[category] = newValues[category].filter(v => v !== value);
    } else {
      newValues[category] = [...newValues[category], value];
    }
    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  const handleSalaryRangeChange = (values) => {
    const newValues = {
      ...selectedValues,
      salary_ranges: {
        ...selectedValues.salary_ranges,
        min: values[0],
        max: values[1]
      }
    };
    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  const handleSalaryDurationChange = (duration) => {
    const newValues = {
      ...selectedValues,
      salary_ranges: {
        ...selectedValues.salary_ranges,
        duration
      }
    };
    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  const handleReset = () => {
    const resetValues = {
      location: options.locations?.[0]?.value || '',
      employment_types: [],
      experience_levels: [],
      salary_ranges: { min: 0, max: 3500, duration: 'monthly' },
      category: [],
      tags: []
    };
    setSelectedValues(resetValues);
    onReset();
    if (isMobile) onClose();
  };

  // Custom dropdown component
  const LocationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedLocationLabel = options.locations?.find(
      loc => loc.value === selectedValues.location
    )?.label || 'Select a location';

    return (
      <div className="relative">
        <div 
          className="border border-gray-200 rounded-lg p-3 cursor-pointer bg-white flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm truncate">
            {selectedLocationLabel}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
            {options.locations?.map((location) => {
              const countryName = countryCodeMap[location.value.split(',')[0]] || '';
              const fullLabel = countryName ? `${countryName}` : location.label;
              
              return (
                <div
                  key={location.value}
                  className={`p-3 cursor-pointer hover:bg-gray-50 text-sm ${
                    selectedValues.location === location.value ? 'bg-blue-50 text-brand' : ''
                  }`}
                  onClick={() => {
                    handleLocationChange(location.value);
                    setIsOpen(false);
                  }}
                >
                  {fullLabel}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Checkbox section component - only renders if items exist
  const CheckboxSection = ({ title, category, items }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="border-b border-gray-100 pb-6 mt-6 first:mt-0">
        <button
          onClick={() => toggleSection(category)}
          className="font-medium text-gray-900 flex items-center justify-between w-full text-left mb-4"
        >
          <span>{title}</span>
          {expandedSections[category] ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
        {expandedSections[category] && (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map(item => (
              <div key={item.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${category}-${item.value}`}
                  checked={selectedValues[category].includes(item.value)}
                  onChange={() => handleCheckboxChange(category, item.value)}
                  className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-blue-500"
                />
                <label 
                  htmlFor={`${category}-${item.value}`}
                  className="ml-3 text-sm cursor-pointer flex-1 flex justify-between items-center"
                >
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="text-gray-400 text-xs">({item.count})</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tags section component - only renders if tags exist
  const TagsSection = () => {
    if (!options.tags || options.tags.length === 0) return null;
    
    return (
      <div className="border-b border-gray-100 pb-6 mt-6">
        <button
          onClick={() => toggleSection('tags')}
          className="font-medium text-gray-900 flex items-center justify-between w-full text-left mb-4"
        >
          <span>Tags</span>
          {expandedSections.tags ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
            {options.tags.map(tag => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.tags.includes(tag)}
                  onChange={() => handleCheckboxChange('tags', tag)}
                  className="sr-only"
                />
                <span className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors ${
                  selectedValues.tags.includes(tag) 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}>
                  {tag}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Salary section component with working slider
  const SalarySection = () => {
    if (!options.salaryRanges) return null;
    
    return (
      <div className="border-b border-gray-100 pb-6 mt-6">
        <button
          onClick={() => toggleSection('salary_ranges')}
          className="font-medium text-gray-900 flex items-center justify-between w-full text-left mb-4"
        >
          <span>Salary</span>
          {expandedSections.salary_ranges ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
        {expandedSections.salary_ranges && (
          <div>
            <div className="mb-4">
              <Slider
                value={[selectedValues.salary_ranges.min, selectedValues.salary_ranges.max]}
                onValueChange={handleSalaryRangeChange}
                min={0}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={selectedValues.salary_ranges.min}
                onChange={(e) => handleSalaryRangeChange([
                  parseInt(e.target.value) || 0, 
                  selectedValues.salary_ranges.max
                ])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span>-</span>
              <input
                type="number"
                value={selectedValues.salary_ranges.max}
                onChange={(e) => handleSalaryRangeChange([
                  selectedValues.salary_ranges.min,
                  parseInt(e.target.value) || 0
                ])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-sm">USD</span>
            </div>

            <div className="flex gap-4">
              {['weekly', 'monthly', 'hourly'].map(duration => (
                <label key={duration} className="flex items-center">
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedValues.salary_ranges.duration === duration}
                    onChange={() => handleSalaryDurationChange(duration)}
                    className="h-4 w-4 text-brand border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm capitalize">{duration}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile Sidebar Layout
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex-1 overflow-y-auto'>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">Filter By</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable content */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <>
                  {/* Location Dropdown - only if locations exist */}
                  {options.locations?.length > 0 && (
                    <div className="border-b border-gray-100 pb-6">
                      <button
                        onClick={() => toggleSection('location')}
                        className="font-medium text-gray-900 flex items-center justify-between w-full text-left mb-4"
                      >
                        <span>Location</span>
                        {expandedSections.location ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                      {expandedSections.location && <LocationDropdown />}
                    </div>
                  )}

                  {/* Job Type */}
                  <CheckboxSection
                    title="Job Type"
                    category="employment_types"
                    items={options.employment_types}
                  />

                  {/* Experience */}
                  <CheckboxSection
                    title="Experience"
                    category="experience_levels"
                    items={options.experience_levels}
                  />

                  {/* Salary */}
                  <SalarySection />

                  {/* Category */}
                  <CheckboxSection
                    title="Category"
                    category="category"
                    items={options.categories}
                  />

                  {/* Tags */}
                  <TagsSection />
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleReset}
              className="w-full bg-brand hover:bg-brand/90 text-white font-medium"
              disabled={loading}
            >
              Reset Filter
            </Button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop Layout
  return (
    <Card className="w-full h-full max-w-xs border border-gray-200 rounded-lg bg-white overflow-y-auto">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6">Filter By</h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            {/* Location Dropdown - only if locations exist */}
            {options.locations?.length > 0 && (
              <div className="border-b border-gray-100 pb-6">
                <button
                  onClick={() => toggleSection('location')}
                  className="font-medium text-gray-900 flex items-center justify-between w-full text-left mb-4"
                >
                  <span>Location</span>
                  {expandedSections.location ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>
                {expandedSections.location && <LocationDropdown />}
              </div>
            )}

            {/* Job Type */}
            <CheckboxSection
              title="Job Type"
              category="employment_types"
              items={options.employment_types}
            />

            {/* Experience */}
            <CheckboxSection
              title="Experience"
              category="experience_levels"
              items={options.experience_levels}
            />

            {/* Salary */}
            <SalarySection />

            {/* Category */}
            <CheckboxSection
              title="Category"
              category="category"
              items={options.categories}
            />

            {/* Tags */}
            <TagsSection />
          </>
        )}
        
        <Button
          onClick={handleReset}
          className="w-full mt-8 bg-brand hover:bg-brand/90 text-white font-medium"
          disabled={loading}
        >
          Reset Filter
        </Button>
      </div>
    </Card>
  );
};