using System;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AmuLab.Utility
{
    public static class StringHelpers
    {
        public static string GenerateSlug(this string phrase)
        {
            var str = phrase.RemoveDiacritics();
            str = str.RemoveAccent().ToLower();

            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); // invalid chars           
            str = Regex.Replace(str, @"\s+", " ").Trim(); // convert multiple spaces into one space   
            str = str.Substring(0, str.Length <= 60 ? str.Length : 60).Trim(); // cut and trim it   
            str = Regex.Replace(str, @"\s", "-"); // hyphens   

            return str;
        }

        public static string RemoveAccent(this string txt)
        {
            if (string.IsNullOrEmpty(txt))
                return string.Empty;

            var bytes = Encoding.GetEncoding("Cyrillic").GetBytes(txt);
            return Encoding.ASCII.GetString(bytes);
        }

        public static string RemoveDiacritics(this string strThis)
        {
            if (strThis == null)
                return null;
            var sb = new StringBuilder();

            foreach (var c in strThis.Normalize(NormalizationForm.FormD).
                Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark))
            {
                sb.Append(c);
            }

            return sb.ToString();
        }

        public static string BuildRandomString()
        {
            const string chars = "abcdefghijklmnopqrsvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
            var random = new Random();

            return new string(
                Enumerable.Repeat(chars, 8)
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray());
        }
    }
}
