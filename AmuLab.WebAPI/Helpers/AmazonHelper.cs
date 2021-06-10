using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

namespace AmuLab.WebAPI.Helpers
{
    public class AmazonHelper
    {
        private readonly AmazonS3Client _client;
        private static object syncRoot = new object();
        private static Dictionary<string, int> processStatus = new Dictionary<string, int>();

        public AmazonHelper()
        {
            _client = new AmazonS3Client(new BasicAWSCredentials(Core.Constants.Configuration.AwsAccessKey, Core.Constants.Configuration.AwsSecretKey),
                RegionEndpoint.USEast1);
        }

        public bool UploadToS3(string localFilePath, string subDirectoryInBucket, string fileNameInS3, string id)
        {
            var utility = new TransferUtility(_client);
            var request = new TransferUtilityUploadRequest();

            if (string.IsNullOrEmpty(subDirectoryInBucket))
            {
                request.BucketName = Core.Constants.Configuration.AwsBucketName; //no subdirectory just bucket name  
            }
            else
            {   // subdirectory and bucket name  
                request.BucketName = Core.Constants.Configuration.AwsBucketName + @"/" + subDirectoryInBucket;
            }
            request.Key = fileNameInS3; //file name up in S3  
            request.FilePath = localFilePath;
            // request.InputStream = localFilePath;
            request.UploadProgressEvent += (sender, e) => UploadProgressEventCallback(sender, e, id);
            utility.Upload(request); //commensing the transfer  

            return true; //indicate that the file was sent  
        }

        public MemoryStream ReadObjectData(string keyName, out string contentType)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = Core.Constants.Configuration.AwsBucketName,
                    Key = keyName
                };
                string responseBody;
                Stream result;
                var ms = new MemoryStream();
                using (var response = _client.GetObject(request))
                using (var responseStream = response.ResponseStream)
                using (var reader = new StreamReader(responseStream))
                {
                    var title = response.Metadata["x-amz-meta-title"]; // Assume you have "title" as medata added to the object.
                    contentType = response.Headers["Content-Type"];
                    Console.WriteLine("Object metadata, Title: {0}", title);
                    Console.WriteLine("Content type: {0}", contentType);
                    result = responseStream;
                    responseBody = reader.ReadToEnd(); // Now you process the response body.
                    responseStream.CopyTo(ms);
                }

                return ms;
            }
            catch (AmazonS3Exception e)
            {
                // If bucket or object does not exist
                Console.WriteLine("Error encountered ***. Message:'{0}' when reading object", e.Message);
                throw;
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when reading object", e.Message);
                throw;
            }
        }

        public ListObjectsV2Response ListingObjects()
        {
            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = Core.Constants.Configuration.AwsBucketName,
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

        public bool Delete(string keyName)
        {
            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = Core.Constants.Configuration.AwsBucketName,
                    Key = keyName
                };
                var res = _client.DeleteObject(deleteObjectRequest);
                return res.HttpStatusCode == HttpStatusCode.OK;
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when deleting an object", e.Message);
                throw;
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when deleting an object", e.Message);
                throw;
            }
        }

        public bool UploadObject(System.IO.Stream localFile, string subDirectoryInBucket, string keyName)
        {
            // Create list to store upload part responses.
            var uploadResponses = new List<UploadPartResponse>();

            // Setup information required to initiate the multipart upload.
            var initiateRequest = new InitiateMultipartUploadRequest
            {
                BucketName = Core.Constants.Configuration.AwsBucketName,
                Key = keyName
            };

            // Initiate the upload.
            var initResponse =
                _client.InitiateMultipartUpload(initiateRequest);

            // Upload parts.
            var contentLength = localFile.Length;
            var partSize = 20 * (long)Math.Pow(2, 20); // 20 MB

            try
            {
                Console.WriteLine("Uploading parts");

                long filePosition = 0;
                for (var i = 1; filePosition < contentLength; i++)
                {
                    var uploadRequest = new UploadPartRequest
                    {
                        BucketName = Core.Constants.Configuration.AwsBucketName + (string.IsNullOrEmpty(subDirectoryInBucket) ? "" : $@"/{subDirectoryInBucket}"),
                        Key = keyName,
                        UploadId = initResponse.UploadId,
                        PartNumber = i,
                        PartSize = partSize,
                        FilePosition = filePosition,
                        InputStream = localFile
                    };

                    // Track upload progress.
                    uploadRequest.StreamTransferProgress += UploadPartProgressEventCallback;

                    // Upload a part and add the response to our list.
                    uploadResponses.Add(_client.UploadPart(uploadRequest));

                    filePosition += partSize;
                }

                // Setup to complete the upload.
                var completeRequest = new CompleteMultipartUploadRequest
                {
                    BucketName = Core.Constants.Configuration.AwsBucketName,
                    Key = keyName,
                    UploadId = initResponse.UploadId
                };
                completeRequest.AddPartETags(uploadResponses);

                // Complete the upload.
                var completeUploadResponse =
                    _client.CompleteMultipartUpload(completeRequest);
                return completeUploadResponse.HttpStatusCode == HttpStatusCode.OK;
            }
            catch (Exception exception)
            {
                Console.WriteLine("An AmazonS3Exception was thrown: {0}", exception.Message);

                // Abort the upload.
                var abortMpuRequest = new AbortMultipartUploadRequest
                {
                    BucketName = Core.Constants.Configuration.AwsBucketName,
                    Key = keyName,
                    UploadId = initResponse.UploadId
                };
                _client.AbortMultipartUpload(abortMpuRequest);
                throw;
            }
        }

        public static void UploadPartProgressEventCallback(object sender, StreamTransferProgressArgs e)
        {
            // Process event. 
            Console.WriteLine("{0}/{1}", e.TransferredBytes, e.TotalBytes);
        }

        public static void UploadProgressEventCallback(object sender, UploadProgressArgs e, string id)
        {
            // Process event. 
            Console.WriteLine("{0}/{1}", e.TransferredBytes, e.TotalBytes);
            lock (syncRoot)
            {
                processStatus[id] = e.PercentDone;
            }
        }

        public void AddProcess(string key)
        {
            lock (syncRoot)
            {
                processStatus.Add(key, 0);
            }
        }

        public int GetStatus(string id)
        {
            lock (syncRoot)
            {
                var process = processStatus[id];
                if (process >= 100)
                {
                    processStatus.Remove(id);
                }
                return process;
            }
        }

        public void SetComplete(string id)
        {
            lock (syncRoot)
            {
                processStatus[id] = 100;
            }
        }
    }
}