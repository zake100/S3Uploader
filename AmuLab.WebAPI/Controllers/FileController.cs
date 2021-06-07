﻿using System.Collections.Generic;
using System.IO;
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

        public FileController(ITmediaService tmediaService)
        {
            _tmediaService = tmediaService;
        }

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
                var a = myUploader.UploadToS3(postedFile.InputStream, s3DirectoryName, name);
                result = result && a;
                if (a)
                {
                    _tmediaService.Add(new TMEDIAEntity
                    {
                        SHRD_KEY = "1000200",
                        MEDIA_NM = Path.GetFileName(name),
                        MEDIA_EXTN = Path.GetExtension(name),
                        MEDIA_FIL_TY = "image/jpeg",
                        MEDIA_SIZE_NBR = postedFile.ContentLength,
                        MEDIA_LOC_PATH = "/post/original/100020014_8caedf2541b54e5abb70e5d23a5b6c67.jpg",
                        MEDIA_EXTR_ID = "d",
                        MEDIA_THUMB_NM = "100020014_8caedf2541b54e5abb70e5d23a5b6c67.jpg",
                        MEDIA_TCD = "03",
                        MEDIA_SCD = "1",
                        MEDIA_PVCY_TCD = "0",
                        OWNR_ID = 100105,
                        ENTY_IP_ADDR = "::1",
                        PBLISH_ON_TCD = "1",
                        POST_ID = 26
                    });
                }
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

        [HttpGet]
        [Route("getUser")]
        public IHttpActionResult GetUser()
        {
            return Ok(new List<string>
            {
                "abc", "def", "123", "456"
            });
        }
    }
}