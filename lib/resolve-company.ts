import type { SupabaseClient } from "@supabase/supabase-js";

import type { CompanyOption, NewCompanyFields } from "@/components/dashboard/company-picker";

export async function resolveCompanyForJob(
  supabase: SupabaseClient,
  userId: string | undefined,
  mode: "existing" | "new",
  selectedCompanyId: string,
  companies: CompanyOption[],
  newCompany: NewCompanyFields
): Promise<{ companyId: string; companyName: string } | { error: string }> {
  if (mode === "existing") {
    if (!selectedCompanyId) {
      return { error: "Please select a company." };
    }
    const company = companies.find((c) => c.id === selectedCompanyId);
    if (!company) {
      return { error: "Selected company not found." };
    }
    return { companyId: company.id, companyName: company.name };
  }

  if (!newCompany.name.trim() || !newCompany.location.trim()) {
    return { error: "Company name and location are required." };
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: newCompany.name.trim(),
      location: newCompany.location.trim(),
      logo_url: newCompany.logo_url,
      logo_bg: newCompany.logo_bg,
      created_by: userId,
    })
    .select("id, name")
    .single();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "Failed to create company." };
  }

  return { companyId: data.id, companyName: data.name };
}
