using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Core.Exceptions
{
    public class BadInfoException : Exception
    {
        public BadInfoException() : base() { }
        public BadInfoException(string message) : base(message) { }
    }
}
