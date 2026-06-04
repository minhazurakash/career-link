"use client";

import { COMPANY_LOGO_PRESETS } from "./constants";
import { FormField, FormSelect } from "./form-field";

export interface CompanyFormValues {
  name: string;
  location: string;
  logo_url: string;
  logo_bg: string;
}

export const emptyCompanyForm = (): CompanyFormValues => ({
  name: "",
  location: "",
  logo_url: COMPANY_LOGO_PRESETS[0].url,
  logo_bg: "#ea4c89",
});

interface CompanyFormFieldsProps {
  values: CompanyFormValues;
  onChange: (values: CompanyFormValues) => void;
}

export function CompanyFormFields({ values, onChange }: CompanyFormFieldsProps) {
  const set = (key: keyof CompanyFormValues, value: string) =>
    onChange({ ...values, [key]: value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        label="Company name *"
        name="name"
        value={values.name}
        onChange={(v) => set("name", v)}
        required
        placeholder="e.g. Acme Corp"
      />
      <FormField
        label="Location *"
        name="location"
        value={values.location}
        onChange={(v) => set("location", v)}
        required
        placeholder="e.g. United States"
      />
      <FormField
        label="Logo color (hex)"
        name="logo_bg"
        value={values.logo_bg}
        onChange={(v) => set("logo_bg", v)}
        placeholder="#ea4c89"
      />
      <FormSelect
        label="Logo preset"
        name="logo_url"
        value={values.logo_url}
        onChange={(v) => set("logo_url", v)}
      >
        {COMPANY_LOGO_PRESETS.map((p) => (
          <option key={p.url} value={p.url}>
            {p.label}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}
