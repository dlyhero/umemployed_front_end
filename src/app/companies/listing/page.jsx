"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Building2, Users, MapPin, ArrowRight, Star, Briefcase } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import baseUrl from "../../api/baseUrl"
import CompanyCard from "../../companies/listing/CompanyCard"

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("featured")
  const router = useRouter()

  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchCompanies = async () => {
      if (status === "unauthenticated") {
        router.push("/api/auth/signin")
        return
      }

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

  if (loading) {
    return <CompaniesLoading />
  }

  // Categorize companies for tabs
  const featuredCompanies = companies.slice(0, 6)
  const techCompanies = companies.filter(c => c.industry === 'Technology').slice(0, 6)
  const startupCompanies = companies.filter(c => c.employees?.includes('1-50') || c.employees?.includes('51-200')).slice(0, 6)

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Companies</h2>
              <p className="text-gray-600">Find your next opportunity with these top employers</p>
            </div>
            <Button 
              variant="outline"
              className="hidden sm:flex border-brand text-brand hover:bg-brand/10"
              onClick={() => router.push("/companies")}
            >
              Browse All Companies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="featured" className="w-full">
          <div className="relative">
            <TabsList className="w-full justify-start overflow-x-auto pb-2">
              <TabsTrigger value="featured" className="px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="tech" className="px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Tech
              </TabsTrigger>
              <TabsTrigger value="startups" className="px-4 py-2">
                <Building2 className="w-4 h-4 mr-2" />
                Startups
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {featuredCompanies.length > 0 ? (
                featuredCompanies.map((company, index) => (
                  <CompanyCard company={company} key={`featured-${index}`} />
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
              {techCompanies.length > 0 ? (
                techCompanies.map((company, index) => (
                  <CompanyCard company={company} key={`tech-${index}`} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No tech companies available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="startups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {startupCompanies.length > 0 ? (
                startupCompanies.map((company, index) => (
                  <CompanyCard company={company} key={`startup-${index}`} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No startup companies available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button
            variant="outline"
            className="border-brand text-brand hover:bg-brand/10 w-full sm:w-auto"
            onClick={() => router.push("/companies")}
          >
            Browse All Companies
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

const CompaniesLoading = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-10 w-32 rounded-md" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((item) => (
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

        <div className="mt-8 flex justify-center">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    </section>
  )
}

export default Companies