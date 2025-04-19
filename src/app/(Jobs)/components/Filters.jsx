import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { ChevronUp, RotateCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';


export default function Filters() {
    const [filters, setFilters] = useState({
        employmentType: {
            fullTime: false,
            partTime: true,
            remote: true,
            training: false
        },
        seniorityLevel: {
            student: true,
            entry: true,
            mid: false,
            senior: false,
            director: false,
            vp: false
        },
        salaryRange: [10000, 500000]
    });
    const FilterSection = ({ title, children, defaultOpen = true, className = '' }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);

        return (
            <div className={className}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-between items-center w-full"
                >
                    <h3 className="font-medium">{title}</h3>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOpen && children}
            </div>
        );
    };


    const FilterCheckbox = ({ id, label, count, checked, onChange }) => {
        return (
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={onChange}
                        className="h-4 w-4 border-gray-300"
                    />
                    <span className="text-sm">{label}</span>
                </label>
                <span className="text-xs text-gray-500">{count}</span>
            </div>
        );
    };
    return (

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-8">
            <h2 className="text-lg font-semibold mb-6">Filters</h2>

            <FilterSection
                title="Type of Employment"
                defaultOpen={true}
            >
                <div className="space-y-3 mt-3">
                    {[
                        { id: 'fullTime', label: 'Full Time Jobs', count: '1:59' },
                        { id: 'partTime', label: 'Part Time Jobs', count: '3:8' },
                        { id: 'remote', label: 'Remote Jobs', count: '5:0' },
                        { id: 'training', label: 'Training Jobs', count: '1:5' }
                    ].map((item) => (
                        <FilterCheckbox
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            count={item.count}
                            checked={filters.employmentType[item.id]}
                            onChange={() => setFilters(prev => ({
                                ...prev,
                                employmentType: {
                                    ...prev.employmentType,
                                    [item.id]: !prev.employmentType[item.id]
                                }
                            }))}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection
                title="Seniority Level"
                defaultOpen={true}
                className="mt-6"
            >
                <div className="space-y-3 mt-3">
                    {[
                        { id: 'student', label: 'Student Level', count: '4:8' },
                        { id: 'entry', label: 'Entry Level', count: '5:1' },
                        { id: 'mid', label: 'Mid Level', count: '1:50' },
                        { id: 'senior', label: 'Senior Level', count: '3:0' },
                        { id: 'director', label: 'Directors', count: '2:0' },
                        { id: 'vp', label: 'VP or Above', count: '1:5' }
                    ].map((item) => (
                        <FilterCheckbox
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            count={item.count}
                            checked={filters.seniorityLevel[item.id]}
                            onChange={() => setFilters(prev => ({
                                ...prev,
                                seniorityLevel: {
                                    ...prev.seniorityLevel,
                                    [item.id]: !prev.seniorityLevel[item.id]
                                }
                            }))}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection
                title="Salary Range"
                defaultOpen={true}
                className="mt-6"
            >
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>MIN: ${filters.salaryRange[0]}</span>
                        <span>MAX: ${filters.salaryRange[1]}</span>
                    </div>
                    <Slider
                        value={filters.salaryRange}
                        onValueChange={(value) => setFilters(prev => ({
                            ...prev,
                            salaryRange: value
                        }))}
                        min={0}
                        max={200000}
                        step={1000}
                        className="w-full"
                    />
                </div>
            </FilterSection>

            <div className="flex gap-3 mt-8">
                <Button className="flex-1 bg-brand text-white hover:bg-brand/80">
                    APPLY
                </Button>
                <Button variant="outline" className="flex-1 text-brand border-brand hover:border-brand hover:text-brand" onClick={() => setFilters({
                    employmentType: {
                        fullTime: false,
                        partTime: false,
                        remote: false,
                        training: false
                    },
                    seniorityLevel: {
                        student: false,
                        entry: false,
                        mid: false,
                        senior: false,
                        director: false,
                        vp: false
                    },
                    salaryRange: [0, 200000]
                })}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    RESET
                </Button>
            </div>
        </div>
    )
}
