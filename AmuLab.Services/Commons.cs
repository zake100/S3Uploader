using AmuLab.Core.Entities;
using System;
using System.Management;
using System.Security.Cryptography;
using System.Text;

namespace AmuLab.Services
{
    public class CommonsLogs
    {
        //public static Dictionary<string, string> DumpModel(object obt)
        //{
        //    Type type = obt.GetType();
        //    if (TypeDefinitionIsList(type))
        //        return null;

        //    PropertyInfo[] properties = obt.GetType().GetProperties();
        //    Func<PropertyInfo, string> func = info =>
        //    {
        //        if (info.PropertyType.GetInterface(typeof(ICatalogue<>).FullName) != null)
        //        {
        //            dynamic propertyValue = info.GetValue(obt, null);
        //            if (propertyValue != null)
        //                return string.Format("{{ Id: {0}, Description: {1} }}",
        //                                     propertyValue.Id,
        //                                     propertyValue.Description);
        //            return "null";
        //        }
        //        object normalValue = info.GetValue(obt, null);
        //        if (normalValue == null) return "null";
        //        return TypeDefinitionIsList(normalValue.GetType()) ? HelpersMessages.NotSupportedList : normalValue.ToString();
        //    };

        //    return properties.ToDictionary(x => "model-" + x.Name, func);
        //}
    }

    public class Secutiry
    {
        public static string GetMd5Hash(string username, string password)
        {
            string sHashWithSalt = password + username;
            // convert this merged value to a byte array
            byte[] saltedHashBytes = Encoding.UTF8.GetBytes(sHashWithSalt);
            // use hash algorithm to compute the hash
            System.Security.Cryptography.HashAlgorithm algorithm = new System.Security.Cryptography.SHA256Managed();
            // convert merged bytes to a hash as byte array
            byte[] hash = algorithm.ComputeHash(saltedHashBytes);
            // return the has as a base 64 encoded string
            string base64 = Convert.ToBase64String(hash);

            string result = GetMd5Hash(base64);
            return result;
        }

        public static string GetMd5Hash(string input)
        {
            MD5 md5Hash = MD5.Create();
            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

    }

    public class Algorithms
    {
        public static readonly HashAlgorithm MD5 = new MD5CryptoServiceProvider();
        public static readonly HashAlgorithm SHA1 = new SHA1Managed();
        public static readonly HashAlgorithm SHA256 = new SHA256Managed();
        public static readonly HashAlgorithm SHA384 = new SHA384Managed();
        public static readonly HashAlgorithm SHA512 = new SHA512Managed();
        public static readonly HashAlgorithm RIPEMD160 = new RIPEMD160Managed();

        public static string GetHash(string value, HashAlgorithm algorithm)
        {
            return BitConverter.ToString(algorithm.ComputeHash(Encoding.UTF8.GetBytes(value))).Replace("-", string.Empty);
        }
    }

    
}
