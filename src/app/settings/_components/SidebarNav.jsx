"use client"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export function SidebarNav({ items }) {
  
  const pathname = usePathname()
    return (
      <nav className="space-y-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-3 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
              {item.icon}
              <span>{item.title}</span>
            </div>
            {item.description && (
              <p className="text-xs text-gray-500 ml-6 mt-1 group-hover:text-gray-600">
                {item.description}
              </p>
            )}
          </a>
        ))}
      </nav>
    );
  
}