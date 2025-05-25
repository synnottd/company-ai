import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod"

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

const companySchema = z.object({
  company: z.string().describe("The company name extracted from the sentence, or an empty string if none found.")
})

const roleSchema = z.object({
  role: z.string().describe("The role name extracted from the sentence, or an empty string if none found.")
})

const companyPrompt = ChatPromptTemplate.fromTemplate(
`Extract the company name from the following sentence.
Only return the company name, nothing else. If there is no company, return an empty string.

Sentence:
{sentence}
`);

const rolePrompt = ChatPromptTemplate.fromTemplate(
`Extract the job title or role name from the following sentence.
Only return the job title or role name, nothing else. If there is no job title or role name, return an empty string.

Sentence:
{sentence}
`)

const model = new ChatOpenAI({
  openAIApiKey,
  model: "gpt-4o-mini",
  temperature: 0,
})

const companyLlmWithStructuredOutput = model.withStructuredOutput(companySchema, {
  name: "companyExtractor",
});
const roleLlmWithStructuredOutput = model.withStructuredOutput(roleSchema, {
  name: "roleExtractor",
});

export async function extractCompany(sentence: string): Promise<string> {
  const invokedPrompted = await companyPrompt.invoke({
    sentence,
  });
  const result = await companyLlmWithStructuredOutput.invoke(invokedPrompted);
  return result.company;
}


export async function extractRole(sentence: string): Promise<string> {
  const invokedPrompted = await rolePrompt.invoke({
    sentence,
  });
  const result = await roleLlmWithStructuredOutput.invoke(invokedPrompted);
  return result.role;
}
