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

        public static string ApiUrl
        {
            get { return ConfigurationManager.AppSettings["ApiUrl"]; }
        }

        public static string ExternalLink
        {
            get { return ConfigurationManager.AppSettings["ExternalLink"]; }
        }

        public static string ImageKit
        {
            get { return ConfigurationManager.AppSettings["ImageKit"]; }
        }       
        public static string TemporaryFolder
        {
            get { return ConfigurationManager.AppSettings["TemporaryFolder"]; }
        }
    }
}