"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { calculateDivination } from "@/lib/divination"
import type { DivinationResult } from "@/lib/divination"
import { SolarDay, LunarDay, EarthBranch } from 'tyme4ts'

// Function to get current time configuration using tyme4ts
function getCurrentTimeConfiguration() {
  const now = new Date()

  // Get lunar date using tyme4ts
  const solarDay = SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const lunarDay = solarDay.getLunarDay()

  // Get current Chinese hour
  const hour = now.getHours()
  const chineseHours = [
    "子", "丑", "丑", "寅", "寅", "卯", "卯", "辰", "辰", "巳", "巳",
    "午", "午", "未", "未", "申", "申", "酉", "酉", "戌", "戌", "亥", "亥", "子"
  ]
  const currentEarthBranch = chineseHours[hour]

  return {
    month: lunarDay.getMonth().toString(),
    day: lunarDay.getDay().toString(),
    hour: currentEarthBranch,
    currentDate: now.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    currentTime: now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    currentHour: currentEarthBranch
  }
}

export default function DivinationCalculator() {
  // Initialize with current time configuration
  const initialConfig = getCurrentTimeConfiguration()
  const [month, setMonth] = useState<string>(initialConfig.month)
  const [day, setDay] = useState<string>(initialConfig.day)
  const [hour, setHour] = useState<string>(initialConfig.hour)
  const [result, setResult] = useState<DivinationResult | null>(null)
  const [currentDate, setCurrentDate] = useState<string>(initialConfig.currentDate)
  const [currentTime, setCurrentTime] = useState<string>(initialConfig.currentTime)
  const [currentHour, setCurrentHour] = useState<string>(initialConfig.currentHour)

  useEffect(() => {
    const updateTime = () => {
      const config = getCurrentTimeConfiguration()
      setCurrentDate(config.currentDate)
      setCurrentTime(config.currentTime)
      setCurrentHour(config.currentHour)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleAutoConfigure = () => {
    const config = getCurrentTimeConfiguration()
    setMonth(config.month)
    setDay(config.day)
    setHour(config.hour)
  }

  const handleRandomTime = () => {
    // Only randomize the hour, keep month and day unchanged
    const hours = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    const randomHour = hours[Math.floor(Math.random() * hours.length)]

    setHour(randomHour)
  }

  const handleCalculate = () => {
    if (!month || !day || !hour) {
      alert("请填写完整信息")
      return
    }

    const calculatedResult = calculateDivination(Number.parseInt(month), Number.parseInt(day), hour)
    setResult(calculatedResult)
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const hours = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

  return (
    <div className="min-h-screen bg-background px-3 py-4">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="text-center space-y-1 py-2">
          <h1 className="text-2xl font-bold text-foreground tracking-wider">戚都翁排盘</h1>
          <p className="text-xs text-muted-foreground tracking-wide">五星占卜 · 体用推算</p>
          <div className="flex flex-col items-center justify-center gap-0.5 pt-1">
            <span className="text-xs text-muted-foreground">{currentDate}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-accent">{currentTime}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-sm font-semibold text-primary">{currentHour}时</span>
            </div>
          </div>
        </div>

        <Card className="border border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-3 space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="month" className="text-xs text-muted-foreground flex items-center gap-1">
                  月份
                  {month && <span className="text-accent">✓</span>}
                </Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month" className="h-9 text-sm">
                    <SelectValue placeholder="月" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m}月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="day" className="text-xs text-muted-foreground flex items-center gap-1">
                  日期
                  {day && <span className="text-accent">✓</span>}
                </Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger id="day" className="h-9 text-sm">
                    <SelectValue placeholder="日" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}日
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hour" className="text-xs text-muted-foreground flex items-center gap-1">
                  时辰
                  {hour && <span className="text-accent">✓</span>}
                </Label>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger id="hour" className="h-9 text-sm">
                    <SelectValue placeholder="时" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}时
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleAutoConfigure}
                variant="outline"
                className="h-10 text-sm font-semibold border-border/50 hover:bg-accent/10"
              >
                自动配置
              </Button>
              <Button
                onClick={handleRandomTime}
                variant="outline"
                className="h-10 text-sm font-semibold border-border/50 hover:bg-muted/50"
              >
                随机时辰
              </Button>
              <Button
                onClick={handleCalculate}
                className="h-10 text-sm font-semibold bg-primary hover:bg-primary/90"
              >
                开始排盘
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-3">
            <Card className="border border-accent/30 bg-card/50 backdrop-blur">
              <CardContent className="p-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg border border-border/30">
                    <span className="text-[10px] text-muted-foreground mb-0.5">月将</span>
                    <span className="text-base font-bold">{result.monthGeneral}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg border border-border/30">
                    <span className="text-[10px] text-muted-foreground mb-0.5">日宫</span>
                    <span className="text-base font-bold">{result.dayPosition}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg border border-border/30">
                    <span className="text-[10px] text-muted-foreground mb-0.5">用星</span>
                    <span className="text-xs font-bold leading-tight">{result.useStar}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2.5 bg-accent/10 rounded-lg border border-accent/30">
                    <span className="text-xs text-muted-foreground">体</span>
                    <span className="text-lg font-bold text-accent">{result.bodyElement}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-accent/10 rounded-lg border border-accent/30">
                    <span className="text-xs text-muted-foreground">用</span>
                    <span className="text-lg font-bold text-accent">{result.useElement}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-primary/20 rounded-lg border border-primary/40">
                    <span className="text-xs font-medium text-primary-foreground/80">关系</span>
                    <span className="text-base font-bold text-primary">{result.relationship}</span>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${result.fortune === "吉" ? "bg-accent/20 border-accent/40" : "bg-destructive/20 border-destructive/40"}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground/70">吉凶</span>
                      <span
                        className={`text-xl font-bold ${result.fortune === "吉" ? "text-accent" : "text-destructive"}`}
                      >
                        {result.fortune}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/80">{result.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold mb-2">旺相休废</h3>
                  <span className="text-xs text-muted-foreground">{result.season}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {result.prosperityTable.map((item) => (
                    <div
                      key={item.element}
                      className={`p-2 rounded-md text-center ${
                        item.status === "旺"
                          ? "bg-accent text-accent-foreground font-bold"
                          : item.status === "相"
                            ? "bg-primary/30 text-primary"
                            : item.status === "休"
                              ? "bg-muted/70 text-muted-foreground"
                              : item.status === "囚"
                                ? "bg-muted/40 text-muted-foreground/70"
                                : "bg-muted/20 text-muted-foreground/50"
                      }`}
                    >
                      <div className="text-sm font-semibold">{item.element}</div>
                      <div className="text-[10px] mt-0.5">{item.status}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-3 space-y-2">
                <h3 className="text-sm font-semibold mb-2">五行原则</h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-accent/10 rounded-md border border-accent/20">
                    <h4 className="text-xs font-semibold text-accent mb-1.5">吉</h4>
                    <ul className="space-y-0.5 text-[11px] leading-tight text-foreground/80">
                      <li>体克用 主动有利</li>
                      <li>用生体 得到帮助</li>
                      <li>比和 平稳顺利</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-destructive/10 rounded-md border border-destructive/20">
                    <h4 className="text-xs font-semibold text-destructive mb-1.5">凶</h4>
                    <ul className="space-y-0.5 text-[11px] leading-tight text-foreground/80">
                      <li>用克体 受到制约</li>
                      <li>体生用 耗损自身</li>
                    </ul>
                  </div>
                </div>

                <div className="p-2 bg-secondary/50 rounded-md border border-border/30">
                  <div className="text-[11px] leading-relaxed text-foreground/70 space-y-0.5">
                    <p>生：木→火→土→金→水→木</p>
                    <p>克：木克土 土克水 水克火 火克金 金克木</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
