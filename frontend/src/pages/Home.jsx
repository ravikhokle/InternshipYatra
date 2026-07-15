import { useEffect, useState, useMemo } from "react";
import { handleError, handleSuccess } from "../Utils";
import axiosInstance from "../api/axiosInstance";
import InternshipCard from "../components/InternshipCard";
import InternshipFilters, { ActiveFilterTags } from "../components/InternshipFilters";
import {
  SORT_OPTIONS,
  filterPosts,
  sortPosts,
  paginatePosts,
  countActiveFilters,
} from "../utils/internshipFilters";

const PER_PAGE = 6;

const DEFAULT_FILTERS = {
  search: "",
  workMode: "All",
  stipend: "all",
  location: "",
  datePosted: "all",
  sortBy: "newest",
};

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
            p === page
              ? "bg-purple-600 text-white border-purple-600"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/posts/showall");
        setAllPosts(response.data || []);
      } catch (error) {
        handleError(error.response?.data?.message || "Failed to load internships");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const processed = useMemo(() => {
    const filtered = filterPosts(allPosts, filters);
    const sorted = sortPosts(filtered, filters.sortBy);
    return paginatePosts(sorted, page, PER_PAGE);
  }, [allPosts, filters, page]);

  const activeFilterCount = countActiveFilters(filters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const handleApplyClick = async (postId) => {
    const _id = localStorage.getItem("userID");
    if (!_id) return handleError("Please login to apply for internships");

    try {
      const response = await axiosInstance.get("/posts/apply", {
        params: { postId, _id },
      });
      if (response.status === 200) {
        handleSuccess(response?.data.message || "Application submitted successfully!");
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f2ef]">
      {/* Hero cover with photo */}
      <div className="bg-gradient-to-r from-[#c599e52d] via-[#ca84fc63] to-[#e2ccf23c] w-full md:p-5 pb-5">
        <div className="px-6 md:px-16 lg:px-32 flex flex-col lg:flex-row h-full sm:gap-10">
          <div className="w-full lg:w-[50%] mb-6 lg:mb-0 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl pt-10 lg:pt-20 font-semibold text-gray-900">
              Explore Fresh Internship Opportunities Every Day
            </h1>
            <p className="py-5 text-[#303030]">
              Thousands of internships in all the leading sectors are waiting for you.
            </p>
            <div className="py-3 mt-5 md:mr-10 sm:px-5 sm:py-5 sm:mr-0 flex items-center bg-white rounded-md shadow-sm">
              <img
                className="h-5 px-3"
                src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/cohzy0fnjfdq5y4hnoop.png"
                alt="Search Icon"
              />
              <input
                className="outline-none w-1/2 flex-grow text-sm md:text-base"
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Internship Title, Company, or Skills"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-[50%]">
            <img
              className="rounded-md shadow-[0_4px_10px_rgba(0,0,0,.5)] max-w-full"
              src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079377/frontend/elbniakmztqdfer8n4hc.jpg"
              alt="Explore internships"
            />
          </div>
        </div>
      </div>

      {/* Listings section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center justify-between gap-2 py-3 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-purple-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <aside className={`lg:w-80 shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24">
              <InternshipFilters
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                activeCount={activeFilterCount}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Internships</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {processed.totalItems} {processed.totalItems === 1 ? "result" : "results"} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-xs text-gray-500 font-medium shrink-0">
                  Sort by
                </label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-white shadow-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ActiveFilterTags
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : processed.items.length > 0 ? (
              <>
                <div className="space-y-4">
                  {processed.items.map((post) => (
                    <InternshipCard key={post._id} post={post} onApply={handleApplyClick} />
                  ))}
                </div>
                <Pagination page={page} totalPages={processed.totalPages} setPage={setPage} />
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <p className="text-gray-600 font-medium">No internships match your filters</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting filters or search terms</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
