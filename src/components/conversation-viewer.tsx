import * as React from "react"
import { Message } from "./message"
import { MessageInput } from "./message-input"
import { extractCompany, extractRole } from "@/lib/ai"
import {
  questions,
  initialState,
  getKeyForStep,
  reducer
} from "./conversation-reducer"
import { validateIndustry } from "@/lib/fetchValidateIndustry"
import { Button } from "./ui/button"
import { getAllReports, storeReport } from "@/lib/reportDB"
import { toast } from "sonner"

export const ConversationViewer: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const chatRef = React.useRef<HTMLDivElement>(null)
  const scrollToBottom = () => requestAnimationFrame(() => chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    }));

  

  const handleInputChange = (text: string) => {
    dispatch({ type: "USER_INPUT", text })
  }

  const handleSend = async () => {
    if (!state.input.trim() || state.loading) {
      return;
    }
    const step = state.step
    const lastUserMsg = state.input
    let value = lastUserMsg
    let key = getKeyForStep(step)
  
    dispatch({ type: "SEND" })

    try {
      if (key === "company") {
        value = await extractCompany(lastUserMsg)
      } else if (key === "role") {
        value = await extractRole(lastUserMsg)
      }
      if (value.trim() === "") {
        dispatch({ type: "SET_ERROR", error: `AI couldn't extract the information. Please try again.` })
        scrollToBottom();
        return
      }
    } catch {
      dispatch({ type: "SET_ERROR", error: "Error extracting information. Please try again." })
      scrollToBottom();
      return
    }
    
    // Validate food industry question
    if (key === "foodIndustry") {
      const normalized = value.trim().toLowerCase()
      if (!/^(yes|no|y|n)$/.test(normalized)) {
        dispatch({ type: "SET_ERROR", error: "Please answer yes or no." })
        scrollToBottom();
        return
      }
    }

    dispatch({ type: "NEXT_STEP", key, value })
    if (key === "company" || key === "role") {
       dispatch({ type: "AI_REPLY", text: `Your ${key} is "${value}".` })
    }
   
    // Ask next question if not done
    if (step + 1 < questions.length) {
      dispatch({ type: "AI_REPLY", text: questions[step + 1] })
    }
    // Prepare report if all questions are answered
    if (step + 1 === questions.length && !state.companyReport) {
      // Prepare data for Company interface
      const answers = state.answers
      const companyName = answers.company || ""
      const role = answers.role || ""
      const objective = answers.goal || ""
      const idealOutput = lastUserMsg || ""
      const industryConfirmed = /^yes|y$/i.test((answers.foodIndustry || "").trim())
      // Validate industry and get overview
      let companyOverview = ""
      let industryMatch = false
      try {
        const result = await validateIndustry(companyName)
        companyOverview = result.companyOverview
        industryMatch = result.industryMatch
      } catch (e) {
        companyOverview = "Could not fetch company overview."
      }
      const companyReport = {
        companyName,
        role,
        objective,
        idealOutput,
        industryConfirmed: industryConfirmed && industryMatch,
        companyOverview,
      }
      dispatch({ type: "SET_COMPANY_REPORT", companyReport })
      // Summarise in an AI message
      const summary = `Here is a summary of your details:\n\n- Company: ${companyName}\n- Role: ${role}\n- Objective: ${objective}\n- Food & Beverage Industry: ${companyReport.industryConfirmed ? "Yes" : "No"}\n- Ideal Output: ${idealOutput}\n- Company Overview: ${companyOverview}`
      dispatch({ type: "AI_REPLY", text: summary })
      try {
        await storeReport(companyReport);
        toast("Report saved successfully!")
      } catch (error) {
        toast("Error saving report.")
      }
      await getAllReports().then(console.log)
    }
    scrollToBottom();
  }

  return (
    <>
    <Button onClick={() => dispatch({ type: "RESET" })} className="mb-4">
      Reset Conversation
    </Button>
    <div className="flex flex-col w-full max-w-md mx-auto border rounded-xl bg-background shadow-md grow shrink overflow-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={chatRef}>
        {state.messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        {state.error && (
          <div className="text-destructive text-sm mt-2">{state.error}</div>
        )}
      </div>
      {state.step < questions.length && (
        <MessageInput
          value={state.input}
          onChange={handleInputChange}
          onSend={handleSend}
          disabled={state.loading}
        />
      )}
    </div>
    </>
  )
  
}
