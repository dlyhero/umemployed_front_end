"use client"
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Briefcase, Calendar, ChevronDown, Crown, Filter, Sparkles, Star, Clock, CheckCircle, DollarSign, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { subDays, format, parseISO } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import baseUrl from '../../api/baseUrl'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import SubscriptionModal from '@/src/components/common/modal/Subscription-modal'

export default function EnhancedResumePage({ params }) {
  const router = useRouter();
  const { data: session } = useSession()
  const [shortlistedJobs, setShortlistedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState({
    has_active_subscription: false,
    tier: null,
    started_at: null,
    ended_at: null
  })
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Safe date parsing function
  const safeParseISO = (dateString) => {
    if (!dateString) return null;
    try {
      const parsed = parseISO(dateString);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch (error) {
      console.error('Date parsing error:', error);
      return null;
    }
  };

  // Check if user has premium tier
  const isPremium = subscription.has_active_subscription && 
                   (subscription.tier === 'premium')

  // Fetch shortlisted jobs and premium status
  const fetchData = async () => {
    try {
      setIsLoading(true);
  
      // Set common headers
      const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
      };
  
      // Fetch shortlisted jobs
      const jobsResponse = await axios.get(
        `${baseUrl}/company/my-shortlisted-jobs/${session.user.user_id}`,
        { headers }
      );
      const jobsData = jobsResponse.data;
      
      // Transform the API response to match our expected format
      const transformedJobs = jobsData.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        shortlisted_date: job.shortlisted_date,
        status: job.status,
        location: job.location,
        salary: job.salary,
        match_score: job.match_score,
      }));
      
      setShortlistedJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
  
      // Fetch subscription status
      const subscriptionResponse = await axios.get(
        `${baseUrl}/transactions/subscription-status/${session.user.user_id}/`,
        { headers }
      );
      const subscriptionData = subscriptionResponse.data;
      setSubscription(subscriptionData);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

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
        const jobDate = safeParseISO(job.shortlisted_date)
        if (!jobDate) return true;
        return jobDate >= dateRange.from && jobDate <= dateRange.to
      })
    }
    
    setFilteredJobs(results)
  }, [statusFilter, dateRange, shortlistedJobs])

  const statusBadgeVariant = (status) => {
    switch(status?.toLowerCase()) {
      case 'interview scheduled': return 'success'
      case 'offer received': return 'brand'
      case 'under review': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  const handleDateSelect = (range) => {
    if (range) {
      setDateRange(range)
      if (range.from && range.to) {
        setIsDatePickerOpen(false)
      }
    }
  }

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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 md:mt-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header with title and upgrade button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enhance Resume <br/> Based on Your Shortlisted Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} found
          </p>
        </div>
        {!isPremium && (
          <Button variant="brand" size="sm" className="gap-2 w-full md:w-fit" asChild>
            <Link href="/pricing">
              <Star className="h-4 w-4" />
              Upgrade to Premium
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
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
            <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              defaultMonth={dateRange?.from}
              fromDate={subDays(new Date(), 365)}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
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
          <Button variant={`brand`} asChild size="sm">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        /* Job cards */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      <Link href={`/jobs/${job.id}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                  </div>
                  <Badge 
                    variant={statusBadgeVariant(job.status)}
                    className="text-xs"
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3 flex-1">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{job.location || 'Remote'}</span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      ${job.salary.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {job.shortlisted_date ? format(safeParseISO(job.shortlisted_date) || new Date(), 'MMM dd, yyyy') : 'Date not available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative h-2 w-16 rounded-full overflow-hidden bg-brand border border-brand">
                      <div 
                        className="absolute h-full bg-brand border-brand" 
                        style={{ width: `${job.match_score || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{job.match_score || 0}% match</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
                
                {isPremium ? (
                  <Button variant={`brand`} size="sm" className="flex-1 gap-1" asChild>
                    <Link href={`/applicant/resume-enhancer/${job.id}`}>
                      Enhance Resume
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant="brand" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => {
                      if (subscription.tier === 'basic') {
                        setShowUpgradeModal(true)
                      }
                    }}
                    asChild={subscription.tier !== 'basic'}
                  >
                    {subscription.tier === 'basic' ? (
                      <>
                        <Crown className="h-4 w-4" />
                        Enhance Resume
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4" />
                        Premium Feature
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade Modal */}
      <SubscriptionModal 
        showSubscriptionModal={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}