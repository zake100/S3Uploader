﻿using System;
using System.Configuration;
using System.IO;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

namespace FileAPI.Helpers
{
    public class AmazonHelper
    {
        private readonly AmazonS3Client _client;
        public AmazonHelper()
        {
            _client = new AmazonS3Client(new BasicAWSCredentials(ConfigurationManager.AppSettings["AWSAccessKey"], ConfigurationManager.AppSettings["AWSSecretKey"]),
                RegionEndpoint.USEast1);
        }

        public bool SendMyFileToS3(System.IO.Stream localFilePath, string subDirectoryInBucket, string fileNameInS3)
        {
            var utility = new TransferUtility(_client);
            var request = new TransferUtilityUploadRequest();

            if (string.IsNullOrEmpty(subDirectoryInBucket))
            {
                request.BucketName = ConfigurationManager.AppSettings["BucketName"]; //no subdirectory just bucket name  
            }
            else
            {   // subdirectory and bucket name  
                request.BucketName = ConfigurationManager.AppSettings["BucketName"] + @"/" + subDirectoryInBucket;
            }
            request.Key = fileNameInS3; //file name up in S3  
            request.InputStream = localFilePath;
            utility.Upload(request); //commensing the transfer  

            return true; //indicate that the file was sent  
        }

        public string ReadObjectData(string keyName)
        {
            var responseBody = string.Empty;
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = ConfigurationManager.AppSettings["BucketName"],
                    Key = keyName
                };
                using (var response = _client.GetObject(request))
                using (var responseStream = response.ResponseStream)
                using (var reader = new StreamReader(responseStream))
                {
                    var title = response.Metadata["x-amz-meta-title"]; // Assume you have "title" as medata added to the object.
                    var contentType = response.Headers["Content-Type"];
                    Console.WriteLine("Object metadata, Title: {0}", title);
                    Console.WriteLine("Content type: {0}", contentType);

                    responseBody = reader.ReadToEnd(); // Now you process the response body.
                }
            }
            catch (AmazonS3Exception e)
            {
                // If bucket or object does not exist
                Console.WriteLine("Error encountered ***. Message:'{0}' when reading object", e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when reading object", e.Message);
            }

            return responseBody;
        }

        public ListObjectsV2Response ListingObjects()
        {
            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = ConfigurationManager.AppSettings["BucketName"],
                    MaxKeys = Int32.MaxValue
                };
                ListObjectsV2Response response;
                do
                {
                    response = _client.ListObjectsV2(request);

                    // Process the response.
                    //foreach (var entry in response.S3Objects)
                    //{
                    //    Console.WriteLine("key = {0} size = {1}",
                    //        entry.Key, entry.Size);
                    //}
                    //Console.WriteLine("Next Continuation Token: {0}", response.NextContinuationToken);
                    request.ContinuationToken = response.NextContinuationToken;
                } while (response.IsTruncated);

                return response;
            }
            catch (AmazonS3Exception amazonS3Exception)
            {
                throw;
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}