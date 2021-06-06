using AmuLab.Core.Enums;

namespace AmuLab.Core.Models.Search
{
    public class Sort
    {
        public SortType SortType { get; set; }
        public string SortOnField { get; set; }
        public string NestedField { get; set; }
        public string NestedFilterValue { get; set; }
    }
}
