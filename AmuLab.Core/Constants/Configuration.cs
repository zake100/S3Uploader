using System.Configuration;

namespace AmuLab.Core.Constants
{
    public class Configuration
    {
        public struct ConstKey
        {
            public const string SignInToken = "SignInTokenVlett";
            public const string SignInUser = "SignInTokenVlett";
            public const string FunctionKey = "FunctionKeyVlett";
            public const string SaltKey = "Pa$$w0rd$altNEverkn0w";
        }

        public static string AwsBucketName
        {
            get { return ConfigurationManager.AppSettings["BucketName"]; }
        }

        public static string AwsAccessKey
        {
            get { return ConfigurationManager.AppSettings["AWSAccessKey"]; }
        }

        public static string AwsSecretKey
        {
            get { return ConfigurationManager.AppSettings["AwsSecretKey"]; }
        }
    }
}