// components/common/LoadingSpinner.tsx
'use client'


export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`flex justify-center items-center ${fullPage ? 'h-screen' : 'h-full'}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e90ff]"></div>
    </div>
  )
}