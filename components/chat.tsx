"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getMessages, sendMessage } from "@/lib/api"

export function Chat({ sellerId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const { data: session } = useSession()

  useEffect(() => {
    const fetchMessages = async () => {
      if (session?.user?.id) {
        try {
          const response = await getMessages(session.user.id, sellerId)
          setMessages(response.data)
        } catch (error) {
          console.error("Failed to fetch messages:", error)
        }
      }
    }
    fetchMessages()
    // Set up real-time updates here (e.g., with WebSockets)
  }, [session, sellerId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && session?.user?.id) {
      try {
        const response = await sendMessage(session.user.id, sellerId, newMessage)
        setMessages([...messages, response.data])
        setNewMessage("")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  return (
    <div className="flex h-[400px] flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === session?.user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-2 max-w-[70%] ${
                message.senderId === session?.user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4 border-t">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

