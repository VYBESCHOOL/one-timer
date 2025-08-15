"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, BarChart3 } from "lucide-react"

type TimerState = "idle" | "running" | "paused" | "break"
type SessionData = {
  task: string
  duration: number
  completedAt: Date
}

const TIMER_DURATIONS = [
  { label: "15 minutes", value: 15 },
  { label: "25 minutes", value: 25 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
]

export default function TimerPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/landing")
    }
  }, [user, loading, router])

  const [task, setTask] = useState("")
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [showStats, setShowStats] = useState(false)
  const [breakTime, setBreakTime] = useState(false)
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("focusone-sessions")
    if (savedSessions) {
      setSessions(
        JSON.parse(savedSessions).map((s: any) => ({
          ...s,
          completedAt: new Date(s.completedAt),
        })),
      )
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("focusone-sessions", JSON.stringify(sessions))
  }, [sessions])

  // Timer logic
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerState === "break" && breakTime) {
      intervalRef.current = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            handleBreakComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState, breakTime])

  const handleTimerComplete = () => {
    setTimerState("idle")

    // Add completed session
    const newSession: SessionData = {
      task,
      duration,
      completedAt: new Date(),
    }
    setSessions((prev) => [...prev, newSession])

    // Start break
    setBreakTime(true)
    setBreakTimeLeft(5 * 60)
    setTimerState("break")

    // Play completion sound (browser beep)
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }

  const handleBreakComplete = () => {
    setBreakTime(false)
    setTimerState("idle")
    setTask("")
    setTimeLeft(duration * 60)
  }

  const startTimer = () => {
    if (!task.trim()) return
    setTimerState("running")
  }

  const pauseTimer = () => {
    setTimerState("paused")
  }

  const stopTimer = () => {
    setTimerState("idle")
    setTimeLeft(duration * 60)
    setBreakTime(false)
  }

  const skipBreak = () => {
    setBreakTime(false)
    setTimerState("idle")
    setTask("")
    setTimeLeft(duration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTodayStats = () => {
    const today = new Date().toDateString()
    const todaySessions = sessions.filter((s) => s.completedAt.toDateString() === today)
    const totalTime = todaySessions.reduce((acc, s) => acc + s.duration, 0)
    return { sessions: todaySessions.length, totalTime }
  }

  const getWeekStats = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekSessions = sessions.filter((s) => s.completedAt >= weekAgo)
    const totalTime = weekSessions.reduce((acc, s) => acc + s.duration, 0)
    return { sessions: weekSessions.length, totalTime }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  // Full-screen timer view
  if (timerState === "running" || timerState === "paused") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl w-full">
          <div className="space-y-4">
            <h1 className="text-2xl font-medium text-muted-foreground">Focus Session</h1>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground break-words">{task}</h2>
          </div>

          <div className="space-y-6">
            <div className="text-8xl md:text-9xl font-mono font-bold text-primary">{formatTime(timeLeft)}</div>

            <div className="flex justify-center gap-4">
              {timerState === "running" ? (
                <Button onClick={pauseTimer} size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              ) : (
                <Button onClick={startTimer} size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Resume
                </Button>
              )}
              <Button onClick={stopTimer} size="lg" variant="destructive" className="gap-2">
                <Square className="w-5 h-5" />
                Stop
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden audio element for completion sound */}
        <audio ref={audioRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
            type="audio/wav"
          />
        </audio>
      </div>
    )
  }

  // Break screen
  if (breakTime && timerState === "break") {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl w-full">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Great Work! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              You completed: <span className="font-semibold">{task}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-6xl font-mono font-bold text-primary">{formatTime(breakTimeLeft)}</div>
            <p className="text-lg text-muted-foreground">Take a short break</p>

            <div className="flex justify-center gap-4">
              <Button onClick={skipBreak} size="lg" variant="outline">
                Skip Break
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main setup screen
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        {/* Header with user info and sign out */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-4xl font-bold text-foreground">FocusOne Timer</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Button onClick={signOut} variant="ghost" size="sm" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Toggle */}
        <div className="flex justify-center">
          <Button onClick={() => setShowStats(!showStats)} variant="ghost" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            {showStats ? "Hide Stats" : "Show Stats"}
          </Button>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{getTodayStats().sessions}</p>
                  <p className="text-sm text-muted-foreground">{getTodayStats().totalTime} minutes focused</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{getWeekStats().sessions}</p>
                  <p className="text-sm text-muted-foreground">{getWeekStats().totalTime} minutes focused</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timer Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Start Your Focus Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What will you focus on?</label>
              <Input
                placeholder="Enter one specific task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="text-lg"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Be specific: "Write introduction for report" not "Work on report"
              </p>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Duration</label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => {
                  const newDuration = Number.parseInt(value)
                  setDuration(newDuration)
                  setTimeLeft(newDuration * 60)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_DURATIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button onClick={startTimer} disabled={!task.trim()} size="lg" className="w-full gap-2">
              <Play className="w-5 h-5" />
              Start Focus Session
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions
                  .slice(-5)
                  .reverse()
                  .map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{session.task}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.completedAt.toLocaleDateString()} at{" "}
                          {session.completedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge variant="secondary">{session.duration}m</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
