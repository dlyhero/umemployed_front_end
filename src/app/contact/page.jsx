"use client"
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact Umemploy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team for support, partnerships, or feedback.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-gray-600 text-sm">support@umemploy.com</p>
                  <p className="text-gray-600 text-sm">partners@umemploy.com</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-600 text-sm">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">Visit Us</h3>
                  <p className="text-gray-600 text-sm">123 Career Lane</p>
                  <p className="text-gray-600 text-sm">Tech City, TC 10001</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Select 
                      onValueChange={(value) => setFormData({...formData, subject: value})}
                      value={formData.subject}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job-seeker">Job Seeker Support</SelectItem>
                        <SelectItem value="employer">Employer Partnership</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button variant={`brand`} type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section - Now visible and responsive */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">How do I create an account?</h3>
              <p className="text-gray-600 text-sm">
                Click "Sign Up" and choose between Job Seeker or Employer accounts.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Is there a mobile app?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Available on both iOS and Android app stores.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">How can employers post jobs?</h3>
              <p className="text-gray-600 text-sm">
                After registering, verify your company to access job posting features.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">What's the response time?</h3>
              <p className="text-gray-600 text-sm">
                We typically respond within 24 hours on business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContactPage