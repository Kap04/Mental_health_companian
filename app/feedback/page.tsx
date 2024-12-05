'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'


export default function FeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/xrbgkebq', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        setIsSubmitted(true)
        form.reset()
      } else {
        console.error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-6 text-green-950 text-center">Feedback Form</h1>
        {isSubmitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Thank you!</strong>
            <span className="block sm:inline"> Your feedback has been submitted successfully.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto  bg-white shadow-md  rounded-3xl px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-green-950 text-sm font-bold mb-2">
                Name
              </label>
              <input type="text" id="name" name="name" required className="w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-green-950 text-sm font-bold mb-2">
                Email
              </label>
              <input type="email" id="email" name="email" required className="w-full" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-green-950 text-sm font-bold mb-2">
                Feedback
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full px-3 py-2 text-green-950 bg-white border rounded-lg focus:outline-none focus:border-indigo-500"
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit 
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}