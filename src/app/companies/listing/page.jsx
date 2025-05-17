"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Building2, Star, Briefcase, Search, Filter, FilterIcon, LucideListFilterPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import baseUrl from "../../api/baseUrl"
import CompanyCard from "../../companies/listing/CompanyCard"
import { Skeleton } from "@/components/ui/skeleton"

const CompanyListing = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchCompanies = async () => {
   
      const token = session?.user?.accessToken || session?.accessToken
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${baseUrl}/company/companies/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCompanies(response.data)
      } catch (err) {
        console.error("Error fetching companies:", err.response || err.message)
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    if (status !== "loading") {
      fetchCompanies()
    }
  }, [status, session, router])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || 
                      (activeTab === "featured" && company.featured) ||
                      (activeTab === "tech" && company.industry === "Technology")

    return matchesSearch && matchesTab
  })

  if (loading) {
    return <CompanyListingLoading />
  }

  return (
    <section className="py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-base">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
          <p className="text-gray-600">Browse all companies on UmEmployed</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-gray-300">
              <LucideListFilterPlus className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </motion.div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="relative">
            <TabsList className="w-full justify-start overflow-x-auto pb-2">
              <TabsTrigger value="all" className="px-4 py-2">
                All Companies
              </TabsTrigger>
              <TabsTrigger value="featured" className="px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="tech" className="px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Tech
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <CompanyCard 
                    company={company} 
                    key={company.id} 
                    onClick={() => router.push(`/companies/${company.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">
                    {searchQuery ? "No companies match your search" : "No companies available"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <CompanyCard 
                    company={company} 
                    key={company.id} 
                    onClick={() => router.push(`/companies/${company.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No featured companies available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tech">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <CompanyCard 
                    company={company} 
                    key={company.id} 
                    onClick={() => router.push(`/companies/${company.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No tech companies available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

const CompanyListingLoading = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-10 w-32 rounded-md" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompanyListing