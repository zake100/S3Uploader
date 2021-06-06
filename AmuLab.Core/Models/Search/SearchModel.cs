using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Core.Models.Search
{
    public class SearchModel<T>
    {
        public SearchModel()
        {
            List = new List<T>();
        }

        public IEnumerable<T> List { get; set; }
        public int Total { get; set; }
    }
}
