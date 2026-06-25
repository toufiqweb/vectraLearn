"use client";

import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "All",
  "Development",
  "Design",
  "Data Science",
  "Marketing",
  "Cloud",
  "Security",
  "Business",
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const SearchCourses = ({
  search,
  setSearch,
  category,
  setCategory,
  level,
  setLevel,
  sort,
  setSort,
  handleReset,
}) => {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-card-border transition-colors duration-300 bg-background/50 backdrop-blur-xl">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-60 w-60 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-60 w-60 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 p-5 md:p-7">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <SlidersHorizontal size={18} className="text-violet-400" />
          </div>

          <div>
            <h3 className="font-semibold text-primary">Filter Courses</h3>
            <p className="text-sm text-muted">
              Search and discover your perfect course
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid gap-4 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              name="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or instructor..."
              className="h-12 w-full rounded-xl border border-card-border transition-colors duration-300 bg-background/50 pl-11 pr-4 outline-none transition-all focus:border-violet-500/40"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-card-border transition-colors duration-300 bg-background/50 px-4 outline-none focus:border-violet-500/40"
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="h-12 rounded-xl border border-card-border transition-colors duration-300 bg-background/50 px-4 outline-none focus:border-violet-500/40"
          >
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 rounded-xl border border-card-border transition-colors duration-300 bg-background/50 px-4 outline-none focus:border-violet-500/40"
          >
            <option value="">Sort By</option>
            <option value="rating">Highest Rating</option>
            <option value="students">Most Students</option>
            <option value="price-low">Price Low → High</option>
            <option value="price-high">Price High → Low</option>
          </select>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-card-border transition-colors duration-300 px-5 py-3 transition hover:border-violet-500/30"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="submit"
              className="bg-main-gradient rounded-xl px-6 py-3 font-medium text-foreground shadow-lg transition hover:scale-[1.02] transition-colors duration-300 "
            >
              Search Courses
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                category === cat
                  ? "bg-violet-600 text-white"
                  : "border border-card-border transition-colors duration-300 hover:border-violet-500/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCourses;
