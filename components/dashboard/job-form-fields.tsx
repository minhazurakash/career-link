"use client";

import { CompanyPicker, type CompanyOption, type NewCompanyFields } from "./company-picker";
import { JOB_TYPES, LOGO_PRESETS } from "./constants";
import { FormField, FormSelect, FormTextarea } from "./form-field";

export interface JobFormValues {
  title: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  logo_url: string;
  logo_bg: string;
  remaining_days: string;
}

export const emptyJobForm = (): JobFormValues => ({
  title: "",
  type: "Full Time",
  location: "",
  salary: "",
  description: "",
  logo_url: LOGO_PRESETS[0].url,
  logo_bg: "#eb524f",
  remaining_days: "30",
});

interface JobFormFieldsProps {
  values: JobFormValues;
  onChange: (values: JobFormValues) => void;
  companies: CompanyOption[];
  companyMode: "existing" | "new";
  onCompanyModeChange: (mode: "existing" | "new") => void;
  selectedCompanyId: string;
  onSelectCompanyId: (id: string) => void;
  newCompany: NewCompanyFields;
  onNewCompanyChange: (fields: NewCompanyFields) => void;
}

export function JobFormFields({
  values,
  onChange,
  companies,
  companyMode,
  onCompanyModeChange,
  selectedCompanyId,
  onSelectCompanyId,
  newCompany,
  onNewCompanyChange,
}: JobFormFieldsProps) {
  const set = (key: keyof JobFormValues, value: string) =>
    onChange({ ...values, [key]: value });

  return (
    <div className="space-y-4">
      <FormField
        label="Job title *"
        name="title"
        value={values.title}
        onChange={(v) => set("title", v)}
        required
        placeholder="e.g. Senior Frontend Developer"
      />

      <CompanyPicker
        companies={companies}
        mode={companyMode}
        onModeChange={onCompanyModeChange}
        selectedCompanyId={selectedCompanyId}
        onSelectCompanyId={onSelectCompanyId}
        newCompany={newCompany}
        onNewCompanyChange={onNewCompanyChange}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <FormSelect
          label="Job type *"
          name="type"
          value={values.type}
          onChange={(v) => set("type", v)}
          required
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </FormSelect>
        <FormField
          label="Location *"
          name="location"
          value={values.location}
          onChange={(v) => set("location", v)}
          required
          placeholder="e.g. San Francisco, CA"
        />
        <FormField
          label="Salary range *"
          name="salary"
          value={values.salary}
          onChange={(v) => set("salary", v)}
          required
          placeholder="e.g. $80K - $100K"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Days remaining"
          name="remaining_days"
          value={values.remaining_days}
          onChange={(v) => set("remaining_days", v)}
          type="number"
          placeholder="30"
        />
        <FormField
          label="Logo color (hex)"
          name="logoBg"
          value={values.logo_bg}
          onChange={(v) => set("logo_bg", v)}
          placeholder="#eb524f"
        />
        <FormSelect
          label="Logo preset"
          name="logoUrl"
          value={values.logo_url}
          onChange={(v) => set("logo_url", v)}
        >
          {LOGO_PRESETS.map((p) => (
            <option key={p.url} value={p.url}>
              {p.label}
            </option>
          ))}
        </FormSelect>
      </div>

      <FormTextarea
        label="Job description"
        name="description"
        value={values.description}
        onChange={(v) => set("description", v)}
        placeholder="Describe the job duties, requirements, benefits, etc."
      />
    </div>
  );
}
