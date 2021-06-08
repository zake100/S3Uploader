using AmuLab.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AmuLab.WebAPI.Models
{
    public class EntitySearch: BaseEntity
    {
        public bool ABOUT_LINE_CNTNT { get; set; }
        public int CRTIF_IND { get; set; }
        public string ENTY_NM { get; set; }
        public string ENTY_URL_ID { get; set; }
        public string ENTY_USR_NM { get; set; }
    }
}