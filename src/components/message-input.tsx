import * as React from "react"
import { Button } from "./ui/button"
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, disabled }) => {
  const [listening, setListening] = React.useState(false)
  const recognitionRef = React.useRef<any>(null)
  React.useEffect(() => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = true
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onChange(transcript)
      if (event.results[0].isFinal) {
        onSend()
      }
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    return () => {
      recognition.stop()
    }
  }, [ ])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSend()
  }

  function handleVoiceInput() {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3 bg-background">
      <input
        className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type a message..."
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <Button type="button" variant={listening ? "secondary" : "ghost"} className="shrink-0" onClick={handleVoiceInput} disabled={disabled} aria-pressed={listening}>
        {listening ? "Stop" : "🎤"}
      </Button>
      <Button type="submit" className="shrink-0" disabled={disabled || !value.trim()}>Send</Button>
    </form>
  )
}
