using System;
using System.Text.RegularExpressions;

namespace AmuLab.WebApp.Helper
{
    public class StringUtils
    {
    }

    public class UnicodeUtility
    {
        public const string uniChars =
    "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ";

        public const string KoDauChars =
            //"aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIOOOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU";
            "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyaaaaaaaaaaaaaaaaaeeeeeeeeeeediiiooooooooooooooooooouuuuuuuuuuuyyyyyaadoou";

        public static string UnicodeToKoDau(string s)
        {
            string retVal = String.Empty;
            int pos;
            for (int i = 0; i < s.Length; i++)
            {
                pos = uniChars.IndexOf(s[i].ToString());
                if (pos >= 0)
                    retVal += KoDauChars[pos];
                else
                    retVal += s[i];
            }
            return retVal;
        }

        public static string RemoveUnicode(string s)
        {
            if (string.IsNullOrEmpty(s))
                return "";
            //return ConvertToUnSign(s);

            //var decomposed = s.ToLower().Normalize(NormalizationForm.FormD);
            //var filtered = decomposed.Where(c => char.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark);
            //string newString = new String(filtered.ToArray());
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = s.ToLower().Normalize(System.Text.NormalizationForm.FormD);
            string retVal = regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'd').Replace('\u0336', ' ').ToLower();
            string newString = Regex.Replace(retVal, "[^0-9a-z]+", " ");
            newString = newString.Replace(" ", "-").TrimEnd('-');
            while (newString.Contains("--"))
                newString = newString.Replace("--", "-");
            return newString;
        }

        public static string HtmlStrip(string text)
        {
            if (string.IsNullOrEmpty(text))
                return "";
            text = text.Trim();
            if (text != "")
            {
                text = Regex.Replace(text, @"<(.|\n)*?>", string.Empty).Replace('"', '\'').Replace("onclick", "").Replace("javascript:", "javascript").TrimStart(':').TrimEnd(':').Replace("^", " ");
            }
            return text;
        }

        private static string ConvertToUnSign(string text)
        {
            text = text.ToLower();
            for (int i = 33; i < 48; i++)
            {
                text = text.Replace(((char)i).ToString(), "");
            }

            for (int i = 58; i < 65; i++)
            {
                text = text.Replace(((char)i).ToString(), "");
            }

            for (int i = 91; i < 97; i++)
            {
                text = text.Replace(((char)i).ToString(), "");
            }
            for (int i = 123; i < 127; i++)
            {
                text = text.Replace(((char)i).ToString(), "");
            }
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = text.Normalize(System.Text.NormalizationForm.FormD);

            string retVal = regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'd').Replace('\u0336', ' ').ToLower();
            retVal = retVal.Replace(" ", "-");
            while (retVal.Contains("--"))
            {
                retVal = retVal.Replace("--", "-");
            }

            return retVal;
        }

        public static string UnicodeToKoDauAndGach(string s)
        {
            if (string.IsNullOrEmpty(s))
                return "";

            string retVal = String.Empty;           

            int pos;
            for (int i = 0; i < s.Length; i++)
            {
                pos = uniChars.IndexOf(s[i].ToString());
                if (pos >= 0)
                    retVal += KoDauChars[pos];
                else
                    retVal += s[i];
            }            

            String temp = retVal;
            for (int i = 0; i < retVal.Length; i++)
            {
                pos = Convert.ToInt32(retVal[i]);
                if (!((pos >= 97 && pos <= 122) || (pos >= 65 && pos <= 90) || (pos >= 48 && pos <= 57) || pos == 32))
                    temp = temp.Replace(retVal[i].ToString(), "");
            }
            temp = temp.Replace(" ", "-");
            
            while (temp.IndexOf("--") >= 0)
                temp = temp.Replace("--", "-");

            retVal = temp;

            return retVal.ToLower();
        }


        public static string UnicodeToKoDauV2(string s)
        {
            if (string.IsNullOrEmpty(s))
                return "";

            string retVal = String.Empty;

            int pos;
            for (int i = 0; i < s.Length; i++)
            {
                pos = uniChars.IndexOf(s[i].ToString());
                if (pos >= 0)
                    retVal += KoDauChars[pos];
                else
                    retVal += s[i];
            }

            String temp = retVal;
            for (int i = 0; i < retVal.Length; i++)
            {
                pos = Convert.ToInt32(retVal[i]);
                if (!((pos >= 97 && pos <= 122) || (pos >= 65 && pos <= 90) || (pos >= 48 && pos <= 57) || pos == 32))
                    temp = temp.Replace(retVal[i].ToString(), "");
            }            

            return retVal;
        }

    }

    public class RomanNumber
    {
        public static string ConvertToRoman(int number)
        {
            
            if (number.ToString().Trim().Length == 0)
                return "";

            if (number >= 4000)
            {
                return "";
            }

            String[] roman = new String[] { "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" };
            int[] decimals = new int[] { 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 };

            string romanvalue = String.Empty;

            for (int i = 0; i < 13; i++)
            {
                while (number >= decimals[i])
                {
                    number -= decimals[i];
                    romanvalue += roman[i];
                }
            }

            return romanvalue;
        } 
    }
}