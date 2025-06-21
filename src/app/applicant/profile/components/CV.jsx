'use client';

import { FileText, Upload, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CVSection = ({ cv, isOwner, onUpload, onDelete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
            setIsUploading(false);
            setFile(null);
        }
    };

    const handleView = () => {
        if (cv?.url) {
            window.open(cv.url, '_blank');
        }
    };

    const handleDownload = () => {
        if (cv?.url) {
            const link = document.createElement('a');
            link.href = cv.url;
            link.download = cv.name || 'resume';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = () => {
        if (cv?.name && onDelete) {
            onDelete(cv.name); // adjust if you're passing an ID instead
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">CV/Resume</h2>
                </div>

                {isOwner && !cv && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-brand hover:text-brand"
                        onClick={() => setIsUploading(true)}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                )}
            </div>

            {cv ? (
                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="text-brand h-10 w-10" />
                        <div>
                            <h3 className="font-medium text-gray-900  truncate w-50">{cv.name}</h3>
                            <p className="text-gray-500 text-sm">
                                {cv.size || 'Unknown size'} · Uploaded {new Date(cv.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" className="gap-2" onClick={handleView}>
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={handleDownload}>
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                        </Button>
                        {isOwner && (
                            <Button
                                variant="outline"
                                className="gap-2 text-red-500 hover:text-red-600"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {isUploading ? 'Upload your CV' : 'No CV uploaded'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {isUploading
                            ? 'Select your resume file to upload'
                            : 'Upload your resume to showcase to recruiters.'}
                    </p>

                    {isUploading ? (
                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cv-upload">Select File (PDF recommended)</Label>
                                <Input
                                    id="cv-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" onClick={() => setIsUploading(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={!file}
                                    className="bg-brand hover:bg-brand/90"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                            </div>
                        </div>
                    ) : (
                        isOwner && (
                            <Button
                                variant="outline"
                                className="mt-4 gap-2 text-brand"
                                onClick={() => setIsUploading(true)}
                            >
                                <Upload className="h-4 w-4" />
                                Upload CV
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};
