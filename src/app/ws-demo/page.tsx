"use client"
import {useEffect, useRef, useState} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {toast} from "sonner"

const ENDPOINTS = [
  process.env.NEXT_PUBLIC_WS_URL || "",
  "wss://ws.ifelse.io",
  "wss://echo-websocket.fly.dev",
  "wss://ws.vi-server.org/mirror",
].filter(Boolean)

export default function WsDemoPage() {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [activeUrl, setActiveUrl] = useState<string>("")
  const [message, setMessage] = useState("")
  const [log, setLog] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let index = 0
    const tryConnect = (attempt = 1) => {
      const url = ENDPOINTS[index % ENDPOINTS.length]
      setActiveUrl(url)
      setStatus("connecting")
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus("connected")
        setLog(prev => [ts() + ` [open] ${url}`, ...prev])
      }
      ws.onmessage = ev => setLog(prev => [ts() + " [recv] " + ev.data, ...prev])
      ws.onerror = () => toast.error("WS error")
      ws.onclose = () => {
        setStatus("disconnected")
        setLog(prev => [ts() + " [close]", ...prev])
        index += 1
        const delay = Math.min(5000, 200 * Math.pow(2, attempt))
        reconnectRef.current = setTimeout(() => tryConnect(attempt + 1), delay)
      }
    }

    tryConnect()
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const send = () => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error("Соединение не установлено")
      return
    }
    const text = message || "ping"
    ws.send(text)
    setLog(prev => [ts() + " [send] " + text, ...prev])
    setMessage("")
  }

  const ts = () => new Date().toLocaleTimeString()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">WebSocket demo (echo)</h2>
      <p className="text-sm text-muted-foreground break-all">
        URL: {activeUrl || "(не выбран)"} — статус: <b>{status}</b>
      </p>
      <div className="flex gap-2">
        <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Введите сообщение"/>
        <Button onClick={send} disabled={status !== "connected"}>Отправить</Button>
      </div>
      <Separator/>
      <div className="grid gap-1">
        {log.map((l, i) => (
          <div key={i} className="text-xs font-mono break-all border-b last:border-0 py-1">{l}</div>
        ))}
      </div>
    </section>
  )
}