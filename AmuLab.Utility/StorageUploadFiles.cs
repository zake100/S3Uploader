using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace AmuLab.Utility
{
    public class StorageUploadFiles
    {
        /// <summary>
        /// Uploads the files.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="fileBinary">The file binary.</param>
        /// <param name="contentType">Type of the content.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <returns></returns>
        public static byte[] UploadFiles(string address, byte[] fileBinary, string contentType, string fileName)
        {
            var request = WebRequest.Create(address);
            request.Method = "POST";
            var boundary = "---------------------------" + DateTime.Now.Ticks.ToString("x", NumberFormatInfo.InvariantInfo);
            request.ContentType = "multipart/form-data; boundary=" + boundary;
            boundary = "--" + boundary;

            using (var requestStream = request.GetRequestStream())
            {
                Stream stream = new MemoryStream(fileBinary);
                // Write the files
                var buffer = Encoding.ASCII.GetBytes(boundary + Environment.NewLine);
                requestStream.Write(buffer, 0, buffer.Length);
                buffer = Encoding.UTF8.GetBytes(string.Format("Content-Disposition: form-data; name=\"upload\"; filename=\"{0}\"{1}", fileName, Environment.NewLine));
                requestStream.Write(buffer, 0, buffer.Length);
                buffer = Encoding.ASCII.GetBytes(string.Format("Content-Type: {0}{1}{1}", contentType, Environment.NewLine));
                requestStream.Write(buffer, 0, buffer.Length);
                stream.CopyTo(requestStream);
                buffer = Encoding.ASCII.GetBytes(Environment.NewLine);
                requestStream.Write(buffer, 0, buffer.Length);

                var boundaryBuffer = Encoding.ASCII.GetBytes(boundary + "--");
                requestStream.Write(boundaryBuffer, 0, boundaryBuffer.Length);
            }

            using (var response = request.GetResponse())
            using (var responseStream = response.GetResponseStream())
            using (var stream = new MemoryStream())
            {
                if (responseStream != null) responseStream.CopyTo(stream);
                return stream.ToArray();
            }
        }

        /// <summary>
        /// Uploads the files.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="fileBinary">The file binary.</param>
        /// <param name="contentType">Type of the content.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <returns></returns>
        public static async Task<byte[]> UploadFilesAsync(string address, byte[] fileBinary, string contentType, string fileName)
        {
            var request = WebRequest.Create(address);
            request.Method = "POST";
            var boundary = "---------------------------" + DateTime.Now.Ticks.ToString("x", NumberFormatInfo.InvariantInfo);
            request.ContentType = "multipart/form-data; boundary=" + boundary;
            boundary = "--" + boundary;

            using (var requestStream = await request.GetRequestStreamAsync())
            {
                Stream stream = new MemoryStream(fileBinary);
                // Write the files
                var buffer = Encoding.ASCII.GetBytes(boundary + Environment.NewLine);
                await requestStream.WriteAsync(buffer, 0, buffer.Length);
                buffer = Encoding.UTF8.GetBytes(string.Format("Content-Disposition: form-data; name=\"upload\"; filename=\"{0}\"{1}", fileName, Environment.NewLine));
                await requestStream.WriteAsync(buffer, 0, buffer.Length);
                buffer = Encoding.ASCII.GetBytes(string.Format("Content-Type: {0}{1}{1}", contentType, Environment.NewLine));
                await requestStream.WriteAsync(buffer, 0, buffer.Length);
                await stream.CopyToAsync(requestStream);
                buffer = Encoding.ASCII.GetBytes(Environment.NewLine);
                await requestStream.WriteAsync(buffer, 0, buffer.Length);

                var boundaryBuffer = Encoding.ASCII.GetBytes(boundary + "--");
                await requestStream.WriteAsync(boundaryBuffer, 0, boundaryBuffer.Length);
            }

            using (var response = await request.GetResponseAsync())
            using (var responseStream = response.GetResponseStream())
            using (var stream = new MemoryStream())
            {
                if (responseStream != null) await responseStream.CopyToAsync(stream);
                return stream.ToArray();
            }
        }

        public static void DeleteImages(string address, List<string> urls)
        {
            var request = WebRequest.Create(address);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            using (var requestStream = request.GetRequestStream())
            {
                // Write the files
                var boundaryBuffer = Encoding.UTF8.GetBytes(Json.Encode(urls));
                requestStream.Write(boundaryBuffer, 0, boundaryBuffer.Length);
            }
            using (var response = request.GetResponse())
            {
            }
        }
    }

    public class StorageResult
    {
        public string Message { get; set; }
        public bool Success { get; set; }
        public DataUpload Data { get; set; }
    }

    public class DataUpload
    {
        public string Domain { get; set; }
        public string Folder { get; set; }
        public string Filename { get; set; }
        public string FullPath { get; set; }
    }

}
