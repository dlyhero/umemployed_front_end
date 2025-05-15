"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Building2, Users, MapPin, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import baseUrl from "../../api/baseUrl"
import CompanyCard from "../../companies/listing/CompanyCard"

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  const { data: session, status } = useSession()
  const router = useRouter()

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
        setCompanies([]) // Treat as empty if error occurs
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

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Companies</h2>
          <p className="text-lg text-gray-600 max-w-2xl">Discover top employers actively hiring on UmEmployed</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
          {companies.length > 0 ? (
            companies.slice(0,3).map((company, index) => (
             <CompanyCard company={company} key={index} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No featured company for the moment.</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-5 "
        >
          {companies.length > 0 && (<a href="/companies" className="inline-flex items-center text-brand hover:text-brand font-medium text-lg group">
            Explore All Companies
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>)}
        </motion.div>
      </div>
    </section>
  )
}

// Skeleton loader component
const CompaniesLoading = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Companies</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover top employers actively hiring on UmEmployed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl overflow-hidden border p-6">
              <div className="flex items-start mb-4">
                <Skeleton className="w-16 h-16 rounded-lg mr-4" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="border-t border-gray-200 mb-4 pt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Companies
