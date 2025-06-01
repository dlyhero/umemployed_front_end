"use client"
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Briefcase, Calendar, ChevronDown, Crown, Filter, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

// DateRangePicker component
function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ShortlistedJobsPage({ params }) {
  const { data: session } = useSession()
  const [shortlistedJobs, setShortlistedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Fetch shortlisted jobs and premium status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch shortlisted jobs
        const jobsResponse = await fetch(
          `/api/company/my-shortlisted-jobs/${params.user_id}`, 
          {
            headers: { Authorization: `Bearer ${session?.accessToken}` }
          }
        )
        const jobsData = await jobsResponse.json()
        setShortlistedJobs(jobsData)
        setFilteredJobs(jobsData)
        
        // Fetch premium status
        const premiumResponse = await fetch('/api/users/premium-status', {
          headers: { Authorization: `Bearer ${session?.accessToken}` }
        })
        const premiumData = await premiumResponse.json()
        setIsPremium(premiumData.isPremium)
        
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (session) {
      fetchData()
    }
  }, [session, params.user_id])

  // Apply filters whenever filters or data changes
  useEffect(() => {
    let results = [...shortlistedJobs]
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(job => job.status === statusFilter)
    }
    
    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      results = results.filter(job => {
        const jobDate = new Date(job.shortlisted_date)
        return jobDate >= dateRange.from && jobDate <= dateRange.to
      })
    }
    
    setFilteredJobs(results)
  }, [statusFilter, dateRange, shortlistedJobs])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-48" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header with title and upgrade button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shortlisted Jobs</h1>
          <p className="text-muted-foreground mt-2">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} found
          </p>
        </div>
        {!isPremium && (
          <Button variant="brand" className="gap-2 w-full md:w-fit">
            <Star className="h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {statusFilter}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('All')}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Under Review')}>
              Under Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Interview Scheduled')}>
              Interview Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Offer Received')}>
              Offer Received
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          className="w-full md:w-auto"
        />
      </div>

      {/* Empty state */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {shortlistedJobs.length === 0 ? 'No shortlisted jobs yet' : 'No jobs match your filters'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {shortlistedJobs.length === 0 
              ? "When companies shortlist you for jobs, they'll appear here." 
              : "Try adjusting your filters to see more results."}
          </p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        /* Job cards */
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <p className="text-lg text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge 
                    variant={
                      job.status === 'Interview Scheduled' ? 'success' : 
                      job.status === 'Offer Received' ? 'brand' : 'outline'
                    }
                    className="text-sm"
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Shortlisted on {new Date(job.shortlisted_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative h-2 w-24 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary" 
                        style={{ width: `${job.match_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{job.match_score}% match</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={`/jobs/${job.id}`}>View Job Details</Link>
                </Button>
                
                {isPremium ? (
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/ai-resume-enhancer/${job.id}`} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Enhance Resume
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="brand" className="gap-2 w-full sm:w-auto">
                    <Crown className="h-4 w-4" />
                    Premium Feature
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}