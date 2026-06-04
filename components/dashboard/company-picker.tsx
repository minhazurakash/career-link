"use client";

import { COMPANY_LOGO_PRESETS, inputClassName, labelClassName } from "./constants";

export interface CompanyOption {
  id: string;
  name: string;
  location: string;
}

export interface NewCompanyFields {
  name: string;
  location: string;
  logo_url: string;
  logo_bg: string;
}

interface CompanyPickerProps {
  companies: CompanyOption[];
  mode: "existing" | "new";
  onModeChange: (mode: "existing" | "new") => void;
  selectedCompanyId: string;
  onSelectCompanyId: (id: string) => void;
  newCompany: NewCompanyFields;
  onNewCompanyChange: (fields: NewCompanyFields) => void;
}

export function CompanyPicker({
  companies,
  mode,
  onModeChange,
  selectedCompanyId,
  onSelectCompanyId,
  newCompany,
  onNewCompanyChange,
}: CompanyPickerProps) {
  return (
    <div className="space-y-4 rounded-lg border border-[#edeff5] bg-[#f8f9fa]/50 p-4">
      <div>
        <span className={labelClassName}>Company *</span>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#18191c]">
            <input
              type="radio"
              name="companyMode"
              checked={mode === "existing"}
              onChange={() => onModeChange("existing")}
              className="accent-[#0a65cc]"
            />
            Select existing company
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#18191c]">
            <input
              type="radio"
              name="companyMode"
              checked={mode === "new"}
              onChange={() => onModeChange("new")}
              className="accent-[#0a65cc]"
            />
            Create new company
          </label>
        </div>
      </div>

      {mode === "existing" ? (
        <div>
          <label className={labelClassName} htmlFor="companyId">
            Select company *
          </label>
          <select
            id="companyId"
            value={selectedCompanyId}
            onChange={(e) => onSelectCompanyId(e.target.value)}
            required
            className={inputClassName}
          >
            <option value="">Choose a company...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.location}
              </option>
            ))}
          </select>
          {companies.length === 0 && (
            <p className="mt-2 text-xs text-[#767f8c]">
              No companies in the directory yet. Create a new company below.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="newCompanyName">
              Company name *
            </label>
            <input
              id="newCompanyName"
              value={newCompany.name}
              onChange={(e) => onNewCompanyChange({ ...newCompany, name: e.target.value })}
              required
              placeholder="e.g. Acme Corp"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="newCompanyLocation">
              Location *
            </label>
            <input
              id="newCompanyLocation"
              value={newCompany.location}
              onChange={(e) => onNewCompanyChange({ ...newCompany, location: e.target.value })}
              required
              placeholder="e.g. San Francisco, CA"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="newCompanyLogoBg">
              Logo color (hex)
            </label>
            <input
              id="newCompanyLogoBg"
              value={newCompany.logo_bg}
              onChange={(e) => onNewCompanyChange({ ...newCompany, logo_bg: e.target.value })}
              placeholder="#ea4c89"
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="newCompanyLogoUrl">
              Logo preset
            </label>
            <select
              id="newCompanyLogoUrl"
              value={newCompany.logo_url}
              onChange={(e) => onNewCompanyChange({ ...newCompany, logo_url: e.target.value })}
              className={inputClassName}
            >
              {COMPANY_LOGO_PRESETS.map((p) => (
                <option key={p.url} value={p.url}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
