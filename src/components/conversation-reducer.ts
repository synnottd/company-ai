import type { Message as MessageType } from "@/types/message"
import type { Company } from "@/types/company"

export const questions = [
  "What company do you work for?",
  "What’s your role?",
  "What are you hoping to achieve with your research?",
  "Is your company in the food and beverage industry?",
  "What would the ideal output look like for you?",
] as const

export type QuestionKey = "company" | "role" | "goal" | "foodIndustry" | "idealOutput"

export interface ConversationState {
  messages: MessageType[]
  answers: Partial<Record<QuestionKey, string>>
  step: number
  input: string
  loading: boolean
  error?: string
  companyReport?: Company
}

export type Action =
  | { type: "USER_INPUT"; text: string }
  | { type: "SEND" }
  | { type: "AI_REPLY"; text: string }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "NEXT_STEP"; key: QuestionKey; value: string }
  | { type: "RESET" }
  | { type: "SET_COMPANY_REPORT"; companyReport: Company }

export const initialState: ConversationState = {
  messages: [
    {
      id: 1,
      text: questions[0],
      sender: "ai",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  answers: {},
  step: 0,
  input: "",
  loading: false,
}

export function getKeyForStep(step: number): QuestionKey {
  switch (step) {
    case 0:
      return "company"
    case 1:
      return "role"
    case 2:
      return "goal"
    case 3:
      return "foodIndustry"
    case 4:
      return "idealOutput"
    default:
      return "goal"
  }
}

export function reducer(state: ConversationState, action: Action): ConversationState {
  switch (action.type) {
    case "USER_INPUT":
      return { ...state, input: action.text }
    case "SEND":
      if (!state.input.trim()) return state
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: state.messages.length + 1,
            text: state.input,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
        loading: true,
        input: "",
      }
    case "AI_REPLY":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: state.messages.length + 1,
            text: action.text,
            sender: "ai",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
        loading: false,
      }
    case "SET_LOADING":
      return { ...state, loading: action.loading }
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false }
    case "NEXT_STEP":
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
        step: state.step + 1,
        loading: false,
        error: undefined,
      }
    case "RESET":
      return initialState
    case "SET_COMPANY_REPORT":
      return { ...state, companyReport: action.companyReport }
    default:
      return state
  }
}
