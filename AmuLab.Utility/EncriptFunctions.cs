using AmuLab.Core.Constants;
using System;
using System.Security.Cryptography;
using System.Text;

namespace AmuLab.Utility
{
    public static class EncriptFunctions
    {
        public static string GenerateMd5String(string strChange)
        {
            var md5Hasher = new MD5CryptoServiceProvider();
            var data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(strChange));
            var sBuilder = new StringBuilder();

            foreach (var t in data)
            {
                sBuilder.Append(t.ToString("x2"));
            }
            return sBuilder.ToString();
        }

        public static bool VerifyMd5String(string str, string hash)
        {
            var hashinput = GenerateMd5String(str);
            var comparer = StringComparer.OrdinalIgnoreCase;
            return 0 == comparer.Compare(hashinput, hash);
        }

        public static string GeneratePassword(string password)
        {
            var strChange = password + Configuration.ConstKey.SaltKey;
            return GenerateMd5String(strChange);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            var strChange = password + Configuration.ConstKey.SaltKey;
            return VerifyMd5String(strChange, hash);
        }
    }
}
