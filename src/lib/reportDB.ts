import { createClient } from "@supabase/supabase-js";
import type { Database } from './database.types'
import type { Company } from "@/types/company";
import { th } from "zod/v4/locales";


const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const storeReport = async (report: Company) => {
  const { data, error } = await supabase
    .from("user")
    .insert([{
        company_name: report.companyName,
        role: report.role,
        objective: report.objective,
        industry_confirmed: report.industryConfirmed,
        ideal_output: report.idealOutput,
        company_overview: report.companyOverview,
    }]);
  if (error) {
    console.error("Error storing report:", error);
    throw new Error("Failed to store report");
  }
  return data;
};

export const getAllReports = async () => {
  const { data, error } = await supabase
    .from("user")
    .select("*");
  if (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
  return data;
};
