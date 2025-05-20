"use client";

import Spinner from "../Spinner";

export default function AuthButtonsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden sm:block">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="w-20 h-9 flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    </div>
  );
}