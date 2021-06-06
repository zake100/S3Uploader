using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using AmuLab.FileAPI.Helpers;

namespace AmuLab.FileAPI.Controllers
{
    [RoutePrefix("api/file")]
    public class FileController : ApiController
    {
        [HttpPost]
        [Route("upload")]
        public IHttpActionResult Upload()
        {
            var httpRequest = HttpContext.Current.Request;
            var files = httpRequest.Files;
            var result = true;
            foreach (string file in files)
            {
                var postedFile = httpRequest.Files[file];
                var name = postedFile.FileName;
                var s3DirectoryName = "";
                var myUploader = new AmazonHelper();
                var a = myUploader.SendMyFileToS3(postedFile.InputStream, s3DirectoryName, name);
                result = result && a;
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("download")]
        public IHttpActionResult Download(string key)
        {
            var myUploader = new AmazonHelper();
            
            var result = myUploader.ReadObjectData(key, out string contentType);
            result.Position = 0;
            var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(result) };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            //response.Content.Headers.ContentDisposition =
            //    new ContentDispositionHeaderValue("attachment") { FileName = fileName };
            return ResponseMessage(response);
        }

        [HttpGet]
        [Route("list")]
        public IHttpActionResult List()
        {
            var myUploader = new AmazonHelper();
            var result = myUploader.ListingObjects();
            return Ok(result);
        }
    }
}
