using System;

namespace AmuLab.Core.Models.Search
{
    public class BaseSearchModel
    {
        public DateTime? CreatedDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public string SortQueryParam { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
        public string Pattern { get; set; }
    }
}
