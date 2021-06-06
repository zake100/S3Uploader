using System;

namespace AmuLab.Core.Helper
{
    public static class StringHelper
    {
        public static DateTime? ConvertDateTime(DateTime? dateTime, int type)
        {
            if (!dateTime.HasValue)
            {
                switch (type)
                {
                    case 0: return new DateTime(1970, 01, 01);
                    case 1: return new DateTime(9999, 12, 31, 23, 59, 59);
                    default: return null;
                }
            }
            return dateTime;
        }

        public static string ConvertDateTime(DateTime dateTime)
        {
            return dateTime.Year + "-" + dateTime.Month.ToString("D2") + "-" + dateTime.Day.ToString("D2") + "T" + dateTime.Hour.ToString("D2") + ":" + dateTime.Minute.ToString("D2") + ":" + dateTime.Second.ToString("D2") + "." + dateTime.Millisecond.ToString("D3");
        }

        public static string ConvertTimeSpan(TimeSpan time)
        {
            return string.Format("{0:D2}:{1:D2}:{2:D2}", time.Hours, time.Minutes, time.Seconds);
        }

        public static string ConvertToUnsign(string value)
        {
            value = value.ToLower();
            string[] arrE = new string[] { "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ề", "ể", "ễ", "ệ", "ệ" };
            string[] arrU = new string[] { "ú", "ù", "ủ", "ũ", "ụ", "ứ", "ừ", "ử", "ữ", "ự", "ư" };
            string[] arrO = new string[] { "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ" };
            string[] arrI = new string[] { "í", "ì", "ỉ", "ĩ", "ị" };
            string[] arrA = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ" };
            string[] arrD = new string[] { "đ" };
            string[] arrY = new string[] { "y", "ý", "ỳ", "ỷ", "ỹ", "ỵ" };
            string[] arrSpecialChar = new string[] { "“", "”", "\"", "<", ">", "[", "]", "!", "~", "&", "(", ")", "|", "{", "}", "?", "@", "#", "$", "%", "*", "+", "\\", "/", "^", "-", "=", ":" };

            for (int i = 0; i <= arrE.Length - 1 - 1; i++)
            {
                if (value.Contains(arrE[i]))
                    value = value.Replace(arrE[i], "e");
            }
            for (int i = 0; i <= arrU.Length - 1; i++)
            {
                if (value.Contains(arrU[i]))
                    value = value.Replace(arrU[i], "u");
            }
            for (int i = 0; i <= arrO.Length - 1; i++)
            {
                if (value.Contains(arrO[i]))
                    value = value.Replace(arrO[i], "o");
            }
            for (int i = 0; i <= arrI.Length - 1; i++)
            {
                if (value.Contains(arrI[i]))
                    value = value.Replace(arrI[i], "i");
            }
            for (int i = 0; i <= arrA.Length - 1; i++)
            {
                if (value.Contains(arrA[i]))
                    value = value.Replace(arrA[i], "a");
            }
            for (int i = 0; i <= arrD.Length - 1; i++)
            {
                if (value.Contains(arrD[i]))
                    value = value.Replace(arrD[i], "d");
            }
            for (int i = 0; i <= arrY.Length - 1; i++)
            {
                if (value.Contains(arrY[i]))
                    value = value.Replace(arrY[i], "y");
            }
            for (int i = 0; i <= arrSpecialChar.Length - 1; i++)
            {
                if (value.Contains(arrSpecialChar[i]))
                    value = value.Replace(arrSpecialChar[i], " ");
            }

            return value;
        }

        public static string FormatStrQuery(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return query;
            }
            string[] arrSpecialChar = new string[] { "“", "”", "<", ">", "[", "]", "!", "~", "&", "(", ")", "|", "{", "}", "?", "@", "#", "$", "%", "*", "+", "\\", "/", "^", "-", "=", ":" };
            for (int i = 0; i <= arrSpecialChar.Length - 1; i++)
            {
                if (query.Contains(arrSpecialChar[i]))
                    query = query.Replace(arrSpecialChar[i], " ");
            }

            int length = query.Split('"').Length - 1;
            if (length > 0 && length % 2 == 1)
            {
                query = query.Remove(query.LastIndexOf('"'), 1);
            }

            query = query.Replace("\"", "\\\"");

            return query;
        }
    }
}
