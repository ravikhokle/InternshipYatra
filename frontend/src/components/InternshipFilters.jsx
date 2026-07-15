import { useState } from "react";
import {
  WORK_MODES,
  STIPEND_FILTERS,
  DATE_POSTED_FILTERS,
} from "../utils/internshipFilters";

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

const FilterSection = ({ title, icon, children, defaultOpen = false }) => {
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
            {icon}
          </span>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
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
      <p className="text-xs text-gray-500 mt-1">Refine results like LinkedIn & Internshala</p>
    </div>

    <div className="px-4">
      <FilterSection
        title="Work type"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      >
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

      <FilterSection
        title="Stipend"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
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

      <FilterSection
        title="Date posted"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      >
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

      <FilterSection
        title="Location"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <div className="relative">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
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
