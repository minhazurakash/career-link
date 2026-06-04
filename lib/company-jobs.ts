import type { SupabaseClient } from "@supabase/supabase-js";

export interface CompanyRef {
  id: string;
  name: string;
}

const JOB_LIST_COLUMNS =
  "id, title, type, location, salary, logo_url, logo_bg, company_name, remaining_days, company_id";

function escapeOrValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Jobs linked by FK or by matching company_name (legacy / seed data). */
export async function fetchJobsForCompany(
  supabase: SupabaseClient,
  company: CompanyRef
) {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_LIST_COLUMNS)
    .or(`company_id.eq.${company.id},company_name.eq.${escapeOrValue(company.name)}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchJobsForCompany:", error);
    return [];
  }

  return data ?? [];
}

/** Count open jobs per company, using company_id first then company_name fallback. */
export async function fetchJobCountsForCompanies(
  supabase: SupabaseClient,
  companies: CompanyRef[]
): Promise<Map<string, number>> {
  const counts = new Map(companies.map((c) => [c.id, 0]));
  if (companies.length === 0) return counts;

  const nameToId = new Map(companies.map((c) => [c.name.toLowerCase(), c.id]));

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("company_id, company_name");

  if (error) {
    console.error("fetchJobCountsForCompanies:", error);
    return counts;
  }

  for (const job of jobs ?? []) {
    let companyId: string | undefined;

    if (job.company_id && counts.has(job.company_id)) {
      companyId = job.company_id;
    } else if (job.company_name) {
      companyId = nameToId.get(job.company_name.toLowerCase());
    }

    if (companyId) {
      counts.set(companyId, (counts.get(companyId) ?? 0) + 1);
    }
  }

  return counts;
}

export function getJobCount(
  counts: Map<string, number>,
  companyId: string
): number {
  return counts.get(companyId) ?? 0;
}
