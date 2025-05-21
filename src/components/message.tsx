import * as React from "react"
import { Card, CardContent } from "./ui/card"
import { UserAvatar, RobotAvatar } from "./ui/avatar"
import type { Message as MessageType } from "@/types/message"

export interface MessageProps {
  message: MessageType
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-center gap-2`}>
      {!isUser && <RobotAvatar />}
      <Card className={`max-w-[75%] ${isUser ? "bg-primary text-primary-foreground rounded-br-md rounded-tl-md rounded-bl-md" : "bg-muted text-foreground rounded-bl-md rounded-tr-md rounded-br-md"}`}>
        <CardContent className="p-3 flex items-end gap-2">
          <span>{message.text}</span>
          <span className="text-xs text-muted-foreground ml-2 self-end">{message.time}</span>
        </CardContent>
      </Card>
      {isUser && <UserAvatar />}
    </div>
  )
}
