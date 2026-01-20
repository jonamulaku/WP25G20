namespace WP25G20.DTOs
{
    public class PagedResultDTO<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
    
    public class FilterDTO
    {
        public string? SearchTerm { get; set; }
        public Dictionary<string, string>? Filters { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
