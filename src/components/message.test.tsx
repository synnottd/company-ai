import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Message } from "./message"
import type { Message as MessageType } from "@/types/message"

describe("Message component", () => {
  const baseMessage: MessageType = {
    id: 1,
    text: "Hello, world!",
    sender: "user",
    time: "12:00",
  }

  it("renders user message with correct text and time", () => {
    render(<Message message={baseMessage} />)
    expect(screen.getByText("Hello, world!")).toBeInTheDocument()
    expect(screen.getByText("12:00")).toBeInTheDocument()
  })

  it("renders ai message with correct text and time", () => {
    const aiMessage: MessageType = { ...baseMessage, sender: "ai", text: "Hi, I am AI!", id: 2 }
    render(<Message message={aiMessage} />)
    expect(screen.getByText("Hi, I am AI!")).toBeInTheDocument()
    expect(screen.getByText("12:00")).toBeInTheDocument()
  })

  it("applies whitespace-pre-wrap to message text", () => {
    const multiLine = { ...baseMessage, text: "Hello\nWorld" }
    render(<Message message={multiLine} />)
    const span = screen.getByText(/Hello/)
    expect(span).toHaveClass("whitespace-pre-wrap")
  })
})
