export function CatalogFilters({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="filters">
      <label className="filter-field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <label className="filter-field">
        <span>Category</span>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
