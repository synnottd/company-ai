import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, vi, expect, beforeEach } from "vitest"
import { ConversationViewer } from "./conversation-viewer"
import { extractCompany } from "@/lib/ai"

Element.prototype.scrollTo = () => {} // Mock scrollTo to prevent errors in tests

// Mock dependencies
vi.mock("@/lib/ai", () => ({
  extractCompany: vi.fn(async (sentence) => "TestCo"),
  extractRole: vi.fn(async (sentence) => "Engineer"),
}))

vi.mock("@/lib/fetchValidateIndustry", () => ({
  validateIndustry: vi.fn(async (company) => ({
    industryMatch: true,
    companyOverview: "A test company in the food industry."
  }))
}))

vi.mock("@/lib/reportDB", () => ({
  storeReport: vi.fn(async () => ({})),
  getAllReports: vi.fn(async () => ([])),
}))

describe("ConversationViewer", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it("renders the first AI question", () => {
    render(<ConversationViewer />)
    expect(screen.getByText(/what company do you work for/i)).toBeInTheDocument()
  })

  it("lets the user answer questions and shows next AI question", async () => {
    render(<ConversationViewer />)
    const input = screen.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: "I work for TestCo" } })
    fireEvent.click(screen.getByText(/send/i))
    await waitFor(() => expect(screen.getByText(/what’s your role/i)).toBeInTheDocument())
    expect(screen.getByText("I work for TestCo")).toBeInTheDocument()
    expect(extractCompany).toHaveBeenCalledWith("I work for TestCo")
  })

  it("shows error if food industry answer is not yes/no", async () => {
    render(<ConversationViewer />)
    // Go through company and role
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: "TestCo" } })
    fireEvent.click(screen.getByText(/send/i))
    await waitFor(() => screen.getByText(/what’s your role/i))
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: "Engineer" } })
    fireEvent.click(screen.getByText(/send/i))
    await waitFor(() => screen.getByText(/what are you hoping to achieve/i))
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: "Research" } })
    fireEvent.click(screen.getByText(/send/i))
    await waitFor(() => screen.getByText(/is your company in the food and beverage industry/i))
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: "maybe" } })
    fireEvent.click(screen.getByText(/send/i))
    await waitFor(() => expect(screen.getByText(/please answer yes or no/i)).toBeInTheDocument())
  })

  it("shows summary after all questions are answered", async () => {
    render(<ConversationViewer />)
    // Go through all questions
    const answer = (text: string) => {
      fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: text } })
      fireEvent.click(screen.getByText(/send/i))
    }
    answer("TestCo")
    await waitFor(() => screen.getByText(/what’s your role/i))
    answer("Engineer")
    await waitFor(() => screen.getByText(/what are you hoping to achieve/i))
    answer("Research")
    await waitFor(() => screen.getByText(/is your company in the food and beverage industry/i))
    answer("yes")
    await waitFor(() => screen.getByText(/what would the ideal output look like/i))
    answer("A report")
    await waitFor(() => screen.getByText(/summary of your details/i))
    expect(screen.getByText(/Company: TestCo/)).toBeInTheDocument()
    expect(screen.getByText(/Role: Engineer/)).toBeInTheDocument()
    expect(screen.getByText(/Company Overview: A test company in the food industry/)).toBeInTheDocument()
  })
})
