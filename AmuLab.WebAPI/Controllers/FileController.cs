using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using AmuLab.Core.Entities;
using AmuLab.Core.Service;
using AmuLab.WebAPI.Helpers;

namespace AmuLab.WebAPI.Controllers
{
    [RoutePrefix("api/file")]
    public class FileController : BaseController
    {
        private readonly ITmediaService _tmediaService;
        private readonly IEntitySearchService _entitySearchService;
        private delegate bool ProcessTask(string localFilePath, string subDirectoryInBucket, string fileNameInS3);

        private readonly AmazonHelper myUploader;

        public FileController(ITmediaService tmediaService, IEntitySearchService entitySearchService)
        {
            _tmediaService = tmediaService;
            _entitySearchService = entitySearchService;
            myUploader = new AmazonHelper();
        }

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult Upload()
        {
            var httpRequest = HttpContext.Current.Request;
            var files = httpRequest.Files;
            var result = true;
            var title = httpRequest.Form.Get("title");
            var content = httpRequest.Unvalidated.Form.Get("content");

            foreach (string file in files)
            {
                var postedFile = httpRequest.Files[file];
                var length = postedFile.ContentLength;
                var contentType = postedFile.ContentType;

                var name = postedFile.FileName;
                var s3DirectoryName = "";
                if (!Directory.Exists(Core.Constants.Configuration.TemporaryFolder))
                {
                    Directory.CreateDirectory(Core.Constants.Configuration.TemporaryFolder);
                }

                var fullPath = $@"{Core.Constants.Configuration.TemporaryFolder}/{name}";
                postedFile.SaveAs(fullPath);
                //var uploadedResult = myUploader.UploadToS3($@"D://Upload/{name}", s3DirectoryName, name);
                var processTask = new ProcessTask(myUploader.UploadToS3);
                processTask.BeginInvoke(fullPath, s3DirectoryName, name, ((res) =>
                {
                    var pT = (ProcessTask)res.AsyncState;
                    var res1 = pT.EndInvoke(res);
                    if (res1)
                    {
                        var entity = new TMEDIAEntity
                        {
                            SHRD_KEY = "1000200",
                            MEDIA_NM = Path.GetFileName(name),
                            MEDIA_EXTN = Path.GetExtension(name),
                            MEDIA_FIL_TY = contentType,
                            MEDIA_SIZE_NBR = length,
                            MEDIA_LOC_PATH = "/post/original/100020014_8caedf2541b54e5abb70e5d23a5b6c67.jpg",
                            MEDIA_EXTR_ID = "d",
                            MEDIA_THUMB_NM = "100020014_8caedf2541b54e5abb70e5d23a5b6c67.jpg",
                            MEDIA_TCD = "03",
                            MEDIA_SCD = "1",
                            MEDIA_PVCY_TCD = "0",
                            OWNR_ID = 100105,
                            ENTY_IP_ADDR = "::1",
                            PBLISH_ON_TCD = "1",
                            POST_ID = 26,
                            MEDIA_TITLE = title,
                            MEDIA_DESC = content
                        };
                        _tmediaService.Add(entity);
                    }
                    File.Delete(fullPath);
                    myUploader.SetComplete();

                }), processTask);
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("download")]
        public IHttpActionResult Download(string key)
        {
            var result = myUploader.ReadObjectData(key, out string contentType);
            result.Position = 0;

            var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(result) };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

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

        [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAll()
        {
            var result = _tmediaService.GetAll().OrderByDescending(c=>c.MEDIA_CDT);
            return Ok(result);
        }

        [HttpGet]
        [Route("getDetail/{id}")]
        public IHttpActionResult GetDetail(long id)
        {
            var result = _tmediaService.GetById(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("delete/{id}")]
        public IHttpActionResult Delete(long id)
        {
            var obj = _tmediaService.GetById(id);
            if (obj == null)
            {
                return InternalServerError();
            }
            //var myUploader = new AmazonHelper();
            //var result = myUploader.Delete(obj.MEDIA_NM);
            //if (result)
            //{
                var result = _tmediaService.Delete(id);
            //}

            return Ok(result);
        }

        [HttpGet]
        [Route("getUploadProgress")]
        public IHttpActionResult GetProgressUpload()
        {
            return Ok(myUploader.GetStatus());
        }
    }
}
