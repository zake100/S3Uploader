// <auto-generated />

// Make sure the compiler doesn't complain about missing Xml comments
#pragma warning disable 1591

using System;
using System.Collections.Generic;
using AmuLab.Core.Entities;

namespace AmuLab.Core.Entities
{
    public partial class TMEDIA_VIEWEntity : BaseEntity
    {
        public long MEDIA_ID { get; set;}
        public long VIEW_ID { get; set;}
        public long? VIEWER_ID { get; set;}
        public string VIEWER_NM { get; set;}
        public string VIEWER_IP_ADDR { get; set;}
        public string VIEWER_DVC_INFO { get; set;}
        public string VIEW_BY_MBER_IND { get; set;}
        public string VIEW_BY_ANYM_IND { get; set;}
        public DateTime VIEW_DT { get; set;}
        public string SHRD_KEY { get; set;}
    }
}
#pragma warning restore 1591
