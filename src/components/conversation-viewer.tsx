import * as React from "react"
import { Message } from "./message"
import type { Message as MessageType} from "@/types/message";
import { MessageInput } from "./message-input";

export interface ConversationViewerProps {
  messages: MessageType[];
}  

export const ConversationViewer: React.FC<ConversationViewerProps> = ({ messages }) => {
  const [inputValue, setInputValue] = React.useState<string>("")
  return (
    <div className="flex flex-col w-full max-w-md mx-auto border rounded-xl bg-background shadow-md grow shrink overflow-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <MessageInput value={inputValue} onChange={setInputValue} onSend={() => {}} />
    </div>
  )
}
