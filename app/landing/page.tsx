"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Timer, Target, BarChart3, Star, ArrowRight } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FocusOne</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-cyan-200">
            ✨ The Single-Task Focus Revolution
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            One Task.
            <br />
            One Timer.
            <br />
            <span className="text-cyan-600">100% Focus.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Break free from multitasking chaos. FocusOne enforces single-task discipline with customizable timers,
            distraction-free sessions, and progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-lg px-8 py-6">
                Start Focusing Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Designed for Deep Work</h2>
            <p className="text-gray-600 text-lg">
              Every feature is crafted to eliminate distractions and maximize focus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Single-Task Enforcement</h3>
                <p className="text-gray-600">Must specify one task before starting. No multitasking allowed.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Timer className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Distraction-Free Timer</h3>
                <p className="text-gray-600">Full-screen focus mode with customizable durations and break reminders.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
                <p className="text-gray-600">Track daily and weekly focus sessions with detailed insights.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 ml-2">Loved by 10,000+ focused professionals</span>
          </div>

          <blockquote className="text-2xl font-medium text-gray-900 mb-6">
            "FocusOne transformed my productivity. The single-task rule changed everything."
          </blockquote>
          <cite className="text-gray-600">— Sarah Chen, Product Designer</cite>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Focus Like Never Before?</h2>
          <p className="text-xl mb-8 text-cyan-100">
            Join thousands of professionals who've mastered single-task focus
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-6">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 FocusOne. Built for deep work and single-task mastery.</p>
        </div>
      </footer>
    </div>
  )
}
