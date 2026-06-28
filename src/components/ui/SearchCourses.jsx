"use client";

import { Search, RotateCcw, X } from "lucide-react";

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
    <div className="bg-card-bg border border-card-border rounded-3xl shadow-lg p-5 sm:p-6 w-full">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        
        {/* Row 1: Main Search Input */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            name="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or instructor..."
            className="w-full h-12 pl-11 pr-11 bg-transparent border border-card-border rounded-xl outline-none focus:border-brand-ocean/50 transition-colors text-foreground"
          />
          {search && (
            <button 
              type="button" 
              onClick={() => setSearch("")} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Row 2: Dropdowns & Search Button */}
        <div className="flex flex-wrap md:flex-nowrap justify-between gap-3 mt-1">
          
          <div className="flex flex-wrap gap-3 flex-1">
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 sm:h-11 px-4 rounded-full border border-card-border bg-transparent outline-none focus:border-brand-ocean/50 text-sm text-foreground appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item} className="bg-card-bg text-foreground">{item}</option>
              ))}
            </select>

            {/* Level Dropdown */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="h-10 sm:h-11 px-4 rounded-full border border-card-border bg-transparent outline-none focus:border-brand-ocean/50 text-sm text-foreground appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {LEVELS.map((item) => (
                <option key={item} value={item} className="bg-card-bg text-foreground">{item}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 sm:h-11 px-4 rounded-full border border-card-border bg-transparent outline-none focus:border-brand-ocean/50 text-sm text-foreground appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="" className="bg-card-bg">Sort By</option>
              <option value="rating" className="bg-card-bg">Highest Rating</option>
              <option value="students" className="bg-card-bg">Most Students</option>
              <option value="price-low" className="bg-card-bg">Price Low → High</option>
              <option value="price-high" className="bg-card-bg">Price High → Low</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto h-10 sm:h-11 px-8 rounded-full bg-main-gradient text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all shrink-0"
          >
            Search Courses
          </button>

        </div>
      </form>

      {/* Row 3: Category Tags & Reset */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-5 border-t border-card-border/50">
        
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-card-border text-muted hover:border-brand-ocean hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-card-border text-muted text-xs font-semibold hover:border-foreground hover:text-foreground transition-all shrink-0"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        
      </div>
    </div>
  );
};

export default SearchCourses;
