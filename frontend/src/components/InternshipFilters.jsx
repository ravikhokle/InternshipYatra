import { useState } from "react";
import {
  WORK_MODES,
  STIPEND_FILTERS,
  DATE_POSTED_FILTERS,
} from "../utils/internshipFilters";
import { AppIcons } from "./AppIcons";

const WORK_MODE_LABELS = {
  All: "All types",
  Remote: "Remote",
  "On-site": "On-site",
  Hybrid: "Hybrid",
};

const FilterRadio = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-offset-0"
    />
    <span className={`text-sm ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
      {label}
    </span>
  </label>
);

const FilterSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
        </div>
        <AppIcons.ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4 pl-1">{children}</div>}
    </div>
  );
};

const InternshipFilters = ({ filters, updateFilter, clearFilters, activeCount }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
    <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppIcons.Filter className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-gray-900">All Filters</h2>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-purple-600 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>

    <div className="px-4">
      <FilterSection title="Work type" icon={AppIcons.Experience}>
        <div className="space-y-0.5">
          {WORK_MODES.map((mode) => (
            <FilterRadio
              key={mode}
              name="workMode"
              value={mode}
              checked={filters.workMode === mode}
              onChange={(v) => updateFilter("workMode", v)}
              label={WORK_MODE_LABELS[mode]}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Stipend" icon={AppIcons.Stipend}>
        <div className="space-y-0.5">
          {STIPEND_FILTERS.map((s) => (
            <FilterRadio
              key={s.value}
              name="stipend"
              value={s.value}
              checked={filters.stipend === s.value}
              onChange={(v) => updateFilter("stipend", v)}
              label={s.label}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Date posted" icon={AppIcons.Calendar}>
        <div className="space-y-0.5">
          {DATE_POSTED_FILTERS.map((d) => (
            <FilterRadio
              key={d.value}
              name="datePosted"
              value={d.value}
              checked={filters.datePosted === d.value}
              onChange={(v) => updateFilter("datePosted", v)}
              label={d.label}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location" icon={AppIcons.Location}>
        <div className="relative">
          <AppIcons.Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            placeholder="City, state, or remote..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-gray-50/50"
          />
        </div>
      </FilterSection>
    </div>

    {activeCount > 0 && (
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full py-2.5 text-sm font-semibold text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors"
        >
          Clear all filters
        </button>
      </div>
    )}
  </div>
);

export const ActiveFilterTags = ({ filters, updateFilter, clearFilters }) => {
  const tags = [];

  if (filters.workMode !== "All") {
    tags.push({ key: "workMode", label: filters.workMode, reset: "All" });
  }
  if (filters.stipend !== "all") {
    const label = STIPEND_FILTERS.find((s) => s.value === filters.stipend)?.label;
    tags.push({ key: "stipend", label: `Stipend: ${label}`, reset: "all" });
  }
  if (filters.datePosted !== "all") {
    const label = DATE_POSTED_FILTERS.find((d) => d.value === filters.datePosted)?.label;
    tags.push({ key: "datePosted", label, reset: "all" });
  }
  if (filters.location?.trim()) {
    tags.push({ key: "location", label: filters.location, reset: "" });
  }

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-medium text-gray-500">Applied:</span>
      {tags.map((tag) => (
        <button
          key={tag.key}
          type="button"
          onClick={() => updateFilter(tag.key, tag.reset)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
        >
          {tag.label}
          <AppIcons.Close className="w-3 h-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearFilters}
        className="text-xs font-medium text-gray-500 hover:text-purple-600 underline"
      >
        Clear all
      </button>
    </div>
  );
};

export default InternshipFilters;
