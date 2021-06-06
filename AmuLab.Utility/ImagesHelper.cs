using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Xml.Serialization;

namespace AmuLab.Utility
{
    public static class ImagesHelper
    {
        public static readonly string UrlHostImage = ConfigurationManager.AppSettings["ImageHost"];
        public static readonly string UploadUrl = ConfigurationManager.AppSettings["ImageHost"];
        public static readonly string VlettHostUrl = ConfigurationManager.AppSettings["VlettHostUrl"];

        public static Image DrawText(String text, Font font, Color textColor, Color backColor)
        {

            //first, create a dummy bitmap just to get a graphics object
            Image img = new Bitmap(1, 1);
            Graphics drawing = Graphics.FromImage(img);

            //measure the string to see how big the image needs to be
            SizeF textSize = drawing.MeasureString(text, font);

            //free up the dummy image and old graphics object
            img.Dispose();
            drawing.Dispose();

            //create a new image of the right size
            img = new Bitmap((int)textSize.Width, (int)textSize.Height);

            drawing = Graphics.FromImage(img);

            //paint the background
            drawing.Clear(backColor);

            //create a brush for the text
            Brush textBrush = new SolidBrush(textColor);

            drawing.DrawString(text, font, textBrush, 0, 0);

            drawing.Save();

            textBrush.Dispose();
            drawing.Dispose();

            return img;
        }

        public static string ConvertVn(string chucodau)
        {
            const string findText = "áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ";
            const string replText = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
            var index = -1;
            var arrChar = findText.ToCharArray();
            while ((index = chucodau.IndexOfAny(arrChar)) != -1)
            {
                var index2 = findText.IndexOf(chucodau[index]);
                chucodau = chucodau.Replace(chucodau[index], replText[index2]);
            }
            return chucodau;
        }

        public static string RemoveSpecialCharacter(string str)
        {
            return Regex.Replace(str, "[^a-zA-Z0-9_.]+", "", RegexOptions.Compiled).ToLower();
        }

        /// <summary>
        /// Gets the height of the image URL width.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <returns></returns>
        public static string GetImageUrlWidthHeight(int width, int height)
        {
            var host = ConfigurationManager.AppSettings["hostStoreImages"];
            return string.Format("{0}/image/{1}_{2}/", host, width, height);
        }

        /// <summary>
        /// Gets the height of the image URL width.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="height">The height.</param>
        /// <param name="path">The path.</param>
        /// <returns></returns>
        public static string GetImageUrlWidthHeight(int width, int height, string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreImages"];
            return string.Format("{0}/image/{1}_{2}/{3}", host, width, height, path);
        }


        public static string GetImageUrlStudioWidthHeight(int width, int height, string path)
        {
            var host = ConfigurationManager.AppSettings["hostStudio"];
            return string.Format("{0}/image/{1}_{2}/{3}", host, width, height, path);
        }

        /// <summary>
        /// Gets the image width only.
        /// </summary>
        /// <param name="width">The width.</param>
        /// <param name="path">The path.</param>
        /// <returns></returns>
        public static string GetImageWidthOnly(int width, string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreImages"];
            return string.Format("{0}/image_w/{1}/{2}", host, width, path);
        }

        /// <summary>
        /// Gets the image height only.
        /// </summary>
        /// <param name="height">The height.</param>
        /// <param name="path">The path.</param>
        /// <returns></returns>
        public static string GetImageHeightOnly(int height, string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreImages"];
            return string.Format("{0}/image_h/{1}/{2}", host, height, path);
        }

        /// <summary>
        /// Gets the image max.
        /// </summary>
        /// <param name="height">The height.</param>
        /// <param name="path">The path.</param>
        /// <returns></returns>
        public static string GetImageMax(int height, string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreImages"];
            return string.Format("{0}/image_max/{1}/{2}", host, height, path);
        }

        public static string GetVideoUrl(string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreVideos"];
            return string.Format("{0}/{1}", host, path);
        }

        public static string GetMerchantDocumentUrl(string path)
        {
            var host = ConfigurationManager.AppSettings["hostStoreMerchantDocument"];
            return string.Format("{0}/{1}", host, path);
        }


        public static string Serialize(List<ImageUrlsSlide> list)
        {
            var serializer = new XmlSerializer(typeof(List<ImageUrlsSlide>));
            var textWriter = new StringWriter();

            serializer.Serialize(textWriter, list);

            return textWriter.ToString();
        }

        public static List<ImageUrlsSlide> Deserialize(string strList)
        {
            if (string.IsNullOrEmpty(strList)) return new List<ImageUrlsSlide>();

            try
            {
                var deserializer = new XmlSerializer(typeof(List<ImageUrlsSlide>));

                object obj = null;

                using (TextReader reader = new StringReader(strList))
                {
                    obj = deserializer.Deserialize(reader);
                }

                var xmlData = new List<ImageUrlsSlide>();

                if (obj != null)
                {
                    xmlData = (List<ImageUrlsSlide>)obj;
                }

                return xmlData;
            }
            catch (Exception)
            {
                return new List<ImageUrlsSlide>();
            }
        }


        public static string SerializeFile(List<FileUrls> list)
        {
            var serializer = new XmlSerializer(typeof(List<FileUrls>));
            var textWriter = new StringWriter();

            serializer.Serialize(textWriter, list);

            return textWriter.ToString();
        }

        public static List<FileUrls> DeserializeFile(string strList)
        {
            if (string.IsNullOrEmpty(strList)) return new List<FileUrls>();

            try
            {
                var deserializer = new XmlSerializer(typeof(List<FileUrls>));

                object obj = null;

                using (TextReader reader = new StringReader(strList))
                {
                    obj = deserializer.Deserialize(reader);
                }

                var xmlData = new List<FileUrls>();

                if (obj != null)
                {
                    xmlData = (List<FileUrls>)obj;
                }

                return xmlData;
            }
            catch (Exception)
            {
                return new List<FileUrls>();
            }

        }

        public const string DefaultImage = "default-image.gif";

        public static Bitmap Download(string imageUrl)
        {
            var request = (HttpWebRequest)WebRequest.Create(imageUrl);
            request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36";

            var response = request.GetResponse();
            var stream = response.GetResponseStream();
            var returnImage = (Bitmap)Image.FromStream(stream);

            return returnImage;
        }

        public static Stream DownloadImage(string imageUrl)
        {

            //using (WebClient webClient = new WebClient())
            // {
            //byte[] data = webClient.DownloadData(imageUrl);

            //MemoryStream mem = new MemoryStream(data);
            // return mem;

            //  }

            var request = (HttpWebRequest)WebRequest.Create(imageUrl);
            request.UseDefaultCredentials = true;
            request.PreAuthenticate = true;
            request.Credentials = CredentialCache.DefaultCredentials;
            var response = request.GetResponse();
            var stream = response.GetResponseStream();

            return stream;
        }

        public static MemoryStream Process(Bitmap inputBitmap, bool isBackGround)
        {
            const string outputExt = "png";

            //Need to check if the image does not support applying gray scale, convert it to 24bit
            if (!isBackGround && inputBitmap.PixelFormat != PixelFormat.Format24bppRgb && inputBitmap.PixelFormat != PixelFormat.Format16bppGrayScale)
            {
                inputBitmap = ProcessBitMap.ConvertToFormat24BppRgb(inputBitmap);
            }

            var photo = (Bitmap)inputBitmap.Clone();

            //if (!isBackGround)
            //{
            //    var addedMoreFivePixcelsImage = inputBitmap;//ProcessBitMap.AddMoreFivePixcelsToOriginalImage(inputBitmap);
            //    var photoBitmap = new Bitmap(addedMoreFivePixcelsImage.Width, addedMoreFivePixcelsImage.Height);
            //    var grayscale = (Bitmap)addedMoreFivePixcelsImage.Clone();

            //    addedMoreFivePixcelsImage.GetPixel(2, 2);
            //    {
            //        //The new pixcel is not support format, but NO worry about this, just skip it.
            //        try
            //        {
            //            var invert = new Invert();
            //            invert.ApplyInPlace(grayscale);
            //        }
            //        catch (Exception)
            //        {
            //        }

            //        grayscale = Grayscale.CommonAlgorithms.BT709.Apply(grayscale);

            //        var sobelEdgeDetector = new SobelEdgeDetector();
            //        sobelEdgeDetector.ApplyInPlace(grayscale);

            //        var gaussianBlur = new GaussianBlur();
            //        gaussianBlur.ApplyInPlace(grayscale);

            //        var threshold = new Threshold(10);
            //        threshold.ApplyInPlace(grayscale);

            //        var otsuThreshold = new OtsuThreshold();
            //        otsuThreshold.ApplyInPlace(grayscale);

            //        var grayscaleToRgb = new GrayscaleToRGB();
            //        var mask = grayscaleToRgb.Apply(grayscale);
            //        var pointedColorFloodFill = new PointedColorFloodFill
            //        {
            //            Tolerance = Color.FromArgb(30, 30, 30),
            //            FillColor = Color.Magenta,
            //            StartingPoint = new IntPoint(0, 0)
            //        };

            //        pointedColorFloodFill.ApplyInPlace(mask);

            //        pointedColorFloodFill.StartingPoint = new IntPoint(photoBitmap.Width - 1, 0);
            //        pointedColorFloodFill.ApplyInPlace(mask);

            //        pointedColorFloodFill.StartingPoint = new IntPoint(0, photoBitmap.Height - 1);
            //        pointedColorFloodFill.ApplyInPlace(mask);

            //        pointedColorFloodFill.StartingPoint = new IntPoint(photoBitmap.Width - 1, photoBitmap.Height - 1);
            //        pointedColorFloodFill.ApplyInPlace(mask);

            //        photoBitmap = ProcessBitMap.CopyWantedPixcelsFromOriginal(mask, addedMoreFivePixcelsImage, photoBitmap);
            //    }

            //    photo = ProcessBitMap.CropUnwantedBackground(photoBitmap) ?? inputBitmap;

            //    grayscale.Dispose();
            //    addedMoreFivePixcelsImage.Dispose();
            //}

            inputBitmap.Dispose();

            var stream = new MemoryStream();
            try
            {
                using (var target = new Bitmap(photo.Width, photo.Height))
                {
                    using (var graphics = Graphics.FromImage(target))
                    {
                        graphics.Clear(Color.Transparent);
                        graphics.CompositingQuality = CompositingQuality.HighSpeed;
                        graphics.SmoothingMode = SmoothingMode.HighQuality;
                        graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
                        graphics.CompositingMode = CompositingMode.SourceCopy;
                        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        graphics.DrawImage(photo, 0, 0, photo.Width, photo.Height);
                        var rectDestination = new Rectangle(0, 0, photo.Width, photo.Height);
                        graphics.DrawImage(photo, rectDestination, 0, 0, photo.Width, photo.Height, GraphicsUnit.Pixel);

                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.DrawImage(photo, rectDestination, 0, 0, photo.Width, photo.Height, GraphicsUnit.Pixel);

                        var codec = ImageCodecInfo.GetImageEncoders()[1]; // 1:JPEG
                        var eParams = new EncoderParameters(1);
                        eParams.Param[0] = new EncoderParameter(Encoder.Quality, 99L);
                        // 100L: highest Quality, 99L: results in Best image
                        var encoders = ImageCodecInfo.GetImageEncoders();

                        var newImg = new Bitmap(photo, photo.Width, photo.Height);
                        // create a new image accordingly

                        using (var memoryStream = new MemoryStream())
                        {
                            target.Save(memoryStream, GetImageFormat(outputExt));
                            target.Save(memoryStream, codec, eParams);
                            newImg.Save(memoryStream, encoders[1], eParams);

                            memoryStream.WriteTo(stream);
                        }
                    }
                }
            }
            catch (Exception)
            {
                // ignored
            }

            stream.Position = 0;

            return stream;
        }


        //public static MemoryStream Process(Bitmap inputBitmap, bool isBackGround)
        //{
        //    const string outputExt = "png";

        //    //Need to check if the image does not support applying gray scale, convert it to 24bit
        //    if (!isBackGround && inputBitmap.PixelFormat != PixelFormat.Format24bppRgb && inputBitmap.PixelFormat != PixelFormat.Format16bppGrayScale)
        //    {
        //        inputBitmap = ProcessBitMap.ConvertToFormat24BppRgb(inputBitmap);
        //    }

        //    var photo = (Bitmap)inputBitmap.Clone();

        //    if (!isBackGround)
        //    {
        //        var addedMoreFivePixcelsImage = inputBitmap;//ProcessBitMap.AddMoreFivePixcelsToOriginalImage(inputBitmap);
        //        var photoBitmap = new Bitmap(addedMoreFivePixcelsImage.Width, addedMoreFivePixcelsImage.Height);
        //        var grayscale = (Bitmap)addedMoreFivePixcelsImage.Clone();

        //        addedMoreFivePixcelsImage.GetPixel(2, 2);
        //        {
        //            //The new pixcel is not support format, but NO worry about this, just skip it.
        //            try
        //            {
        //                var invert = new Invert();
        //                invert.ApplyInPlace(grayscale);
        //            }
        //            catch (Exception)
        //            {
        //            }

        //            grayscale = Grayscale.CommonAlgorithms.BT709.Apply(grayscale);

        //            var sobelEdgeDetector = new SobelEdgeDetector();
        //            sobelEdgeDetector.ApplyInPlace(grayscale);

        //            var gaussianBlur = new GaussianBlur();
        //            gaussianBlur.ApplyInPlace(grayscale);

        //            var threshold = new Threshold(10);
        //            threshold.ApplyInPlace(grayscale);

        //            var otsuThreshold = new OtsuThreshold();
        //            otsuThreshold.ApplyInPlace(grayscale);

        //            var grayscaleToRgb = new GrayscaleToRGB();
        //            var mask = grayscaleToRgb.Apply(grayscale);
        //            var pointedColorFloodFill = new PointedColorFloodFill
        //            {
        //                Tolerance = Color.FromArgb(30, 30, 30),
        //                FillColor = Color.Magenta,
        //                StartingPoint = new IntPoint(0, 0)
        //            };

        //            pointedColorFloodFill.ApplyInPlace(mask);

        //            pointedColorFloodFill.StartingPoint = new IntPoint(photoBitmap.Width - 1, 0);
        //            pointedColorFloodFill.ApplyInPlace(mask);

        //            pointedColorFloodFill.StartingPoint = new IntPoint(0, photoBitmap.Height - 1);
        //            pointedColorFloodFill.ApplyInPlace(mask);

        //            pointedColorFloodFill.StartingPoint = new IntPoint(photoBitmap.Width - 1, photoBitmap.Height - 1);
        //            pointedColorFloodFill.ApplyInPlace(mask);

        //            photoBitmap = ProcessBitMap.CopyWantedPixcelsFromOriginal(mask, addedMoreFivePixcelsImage, photoBitmap);
        //        }

        //        photo = ProcessBitMap.CropUnwantedBackground(photoBitmap) ?? inputBitmap;

        //        grayscale.Dispose();
        //        addedMoreFivePixcelsImage.Dispose();
        //    }

        //    inputBitmap.Dispose();

        //    var stream = new MemoryStream();
        //    try
        //    {
        //        using (var target = new Bitmap(photo.Width, photo.Height))
        //        {
        //            using (var graphics = Graphics.FromImage(target))
        //            {
        //                graphics.Clear(Color.Transparent);
        //                graphics.CompositingQuality = CompositingQuality.HighSpeed;
        //                graphics.SmoothingMode = SmoothingMode.HighQuality;
        //                graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
        //                graphics.CompositingMode = CompositingMode.SourceCopy;
        //                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        //                graphics.DrawImage(photo, 0, 0, photo.Width, photo.Height);
        //                var rectDestination = new Rectangle(0, 0, photo.Width, photo.Height);
        //                graphics.DrawImage(photo, rectDestination, 0, 0, photo.Width, photo.Height, GraphicsUnit.Pixel);

        //                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        //                graphics.DrawImage(photo, rectDestination, 0, 0, photo.Width, photo.Height, GraphicsUnit.Pixel);

        //                var codec = ImageCodecInfo.GetImageEncoders()[1]; // 1:JPEG
        //                var eParams = new EncoderParameters(1);
        //                eParams.Param[0] = new EncoderParameter(Encoder.Quality, 99L);
        //                // 100L: highest Quality, 99L: results in Best image
        //                var encoders = ImageCodecInfo.GetImageEncoders();

        //                var newImg = new Bitmap(photo, photo.Width, photo.Height);
        //                // create a new image accordingly

        //                using (var memoryStream = new MemoryStream())
        //                {
        //                    target.Save(memoryStream, GetImageFormat(outputExt));
        //                    target.Save(memoryStream, codec, eParams);
        //                    newImg.Save(memoryStream, encoders[1], eParams);

        //                    memoryStream.WriteTo(stream);
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // ignored
        //    }

        //    stream.Position = 0;

        //    return stream;
        //}
        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
        
        public static string Upload(MemoryStream stream, string fileUrl)
        {
            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileUrl);
            var fileNameToUpload = string.Format("{0}.png", fileNameWithoutExtension);

            var responseByte = StorageUploadFiles.UploadFiles(UploadUrl, stream.ToArray(), "image/png", fileNameToUpload);
            var results = System.Text.Encoding.UTF8.GetString(responseByte);

            if (string.IsNullOrEmpty(results))
                return string.Empty;

            var resultobj = JsonConvert.DeserializeObject<StorageResult>(results);
            var urlImage = $"{resultobj.Data.Folder}/{resultobj.Data.Filename}";

            return resultobj.Data.FullPath;
        }

        public static ImageFormat GetImageFormat(string fileExtension)
        {
            switch (fileExtension)
            {
                case "png":
                    return ImageFormat.Png;
                case "bmp":
                    return ImageFormat.Bmp;
                case "gif":
                    return ImageFormat.Gif;
                case "jpg":
                case "jpeg":
                    return ImageFormat.Jpeg;
                default:
                    return ImageFormat.Png;
            }
        }

        public static string GetMimeType(string fileName)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentNullException(nameof(fileName));
            }
            string extension = Path.GetExtension(fileName).ToLower();

            if (!extension.StartsWith("."))
            {
                extension = "." + extension;
            }
            string mime;

            if (Mappings.TryGetValue(extension, out mime))
                return mime;
            return "application/octet-stream";
        }

        private static readonly IDictionary<string, string> Mappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase) {
            {".bmp", "image/bmp"},
            {".jpe", "image/jpeg"},
            {".jpeg", "image/jpeg"},
            {".jpg", "image/jpeg"},
            {".png", "image/png"}
        };
    }

    public class ProcessBitMap
    {
        /// <summary>
        /// Find the bounds of this image, then these bounds will be used for cropping.
        /// </summary>
        /// <param name="bmp"></param>
        /// <param name="backColor"></param>
        /// <returns></returns>
        private static System.Drawing.Point[] GetImageBounds(Bitmap bmp, Color backColor)
        {
            Color c;
            int width = bmp.Width, height = bmp.Height;
            var upperLeftPointFounded = false;
            var bounds = new System.Drawing.Point[2];

            var lockbitImages = new LockBitmap(bmp);
            lockbitImages.LockBits();


            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    c = lockbitImages.GetPixel(x, y);
                    var sameAsBackColor = ((c.R <= backColor.R * 1.1 && c.R >= backColor.R * 0.9) &&
                                           (c.G <= backColor.G * 1.1 && c.G >= backColor.G * 0.9) &&
                                           (c.B <= backColor.B * 1.1 && c.B >= backColor.B * 0.9));
                    if (sameAsBackColor)
                        continue;
                    if (!upperLeftPointFounded)
                    {
                        bounds[0] = new System.Drawing.Point(x, y);
                        bounds[1] = new System.Drawing.Point(x, y);
                        upperLeftPointFounded = true;
                    }
                    else
                    {
                        if (x > bounds[1].X)
                            bounds[1].X = x;
                        else if (x < bounds[0].X)
                            bounds[0].X = x;
                        if (y >= bounds[1].Y)
                            bounds[1].Y = y;
                        else if (y < bounds[0].Y)
                            bounds[0].Y = y;
                    }
                }
            }
            lockbitImages.UnlockBits();
            return bounds;
        }

        /// <summary>
        /// Remove unwanted background.
        /// </summary>
        /// <param name="bmp"></param>
        /// <returns></returns>
        public static Bitmap CropUnwantedBackground(Bitmap bmp)
        {
            var bounds = GetImageBounds(bmp, Color.Transparent);
            var diffX = bounds[1].X - bounds[0].X + 1;
            var diffY = bounds[1].Y - bounds[0].Y + 1;
            var croppedBmp = new Bitmap(diffX, diffY);

            var g = Graphics.FromImage(croppedBmp);
            var destRect = new Rectangle(0, 0, croppedBmp.Width, croppedBmp.Height);
            var srcRect = new Rectangle(bounds[0].X, bounds[0].Y, diffX, diffY);
            g.DrawImage(bmp, destRect, srcRect, GraphicsUnit.Pixel);

            return croppedBmp;
        }

        //public static Bitmap AddMoreFivePixcelsToOriginalImage(Bitmap inputBitmap)
        //{
        //    var ouputImage = new Bitmap(inputBitmap.Width + 5, inputBitmap.Height);

        //    unsafe
        //    {
        //        var bitmapData = inputBitmap.LockBits(new Rectangle(0, 0, inputBitmap.Width, inputBitmap.Height), ImageLockMode.ReadWrite, inputBitmap.PixelFormat);
        //        var input2BitMapBitmapData = ouputImage.LockBits(new Rectangle(0, 0, inputBitmap.Width, inputBitmap.Height), ImageLockMode.ReadWrite, inputBitmap.PixelFormat);

        //        var bytesPerPixel = Image.GetPixelFormatSize(inputBitmap.PixelFormat) / 8;
        //        var heightInPixels = bitmapData.Height;
        //        int widthInBytes = bitmapData.Width * bytesPerPixel;
        //        byte* ptrFirstPixel = (byte*)bitmapData.Scan0;
        //        byte* ptrNewImagePixcel = (byte*)input2BitMapBitmapData.Scan0;

        //        for (var y = 0; y < heightInPixels; y++)
        //        {
        //            var currentLine = ptrFirstPixel + (y * bitmapData.Stride);
        //            var inputImageCurrentLine = ptrNewImagePixcel + (y * input2BitMapBitmapData.Stride);

        //            for (var x = 0; x < widthInBytes; x = x + bytesPerPixel)
        //            {
        //                inputImageCurrentLine[x] = currentLine[x];
        //                inputImageCurrentLine[x + 1] = currentLine[x + 1];
        //                inputImageCurrentLine[x + 2] = currentLine[x + 2];
        //            }
        //        }
        //        inputBitmap.UnlockBits(bitmapData);
        //        ouputImage.UnlockBits(input2BitMapBitmapData);
        //    }

        //    return ouputImage;
        //}

        /// <summary>
        /// Copy all expected pixel from original image.
        /// </summary>
        /// <param name="masked"></param>
        /// <param name="inputBitmap"></param>
        /// <param name="copyTo"></param>
        /// <returns></returns>
        //public static Bitmap CopyWantedPixcelsFromOriginal(Bitmap masked, Bitmap inputBitmap, Bitmap copyTo)
        //{
        //    unsafe
        //    {

        //        masked = ConvertTo32Argb(masked);
        //        inputBitmap = ConvertTo32Argb(inputBitmap);
        //        copyTo = ConvertTo32Argb(copyTo);

        //        var maskedData = masked.LockBits(new Rectangle(0, 0, masked.Width, masked.Height), ImageLockMode.ReadWrite, masked.PixelFormat);
        //        var newImageData = copyTo.LockBits(new Rectangle(0, 0, masked.Width, masked.Height), ImageLockMode.ReadWrite, masked.PixelFormat);
        //        var inputBitmapData = inputBitmap.LockBits(new Rectangle(0, 0, masked.Width, masked.Height), ImageLockMode.ReadWrite, masked.PixelFormat);

        //        var bytesPerPixel = Image.GetPixelFormatSize(masked.PixelFormat) / 8;
        //        var heightInPixels = maskedData.Height;
        //        var widthInBytes = maskedData.Width * bytesPerPixel;
        //        var ptrFirstPixel = (byte*)maskedData.Scan0;
        //        var ptrNewImagePixcel = (byte*)newImageData.Scan0;
        //        var ptrInputPixcel = (byte*)inputBitmapData.Scan0;

        //        for (var y = 0; y < heightInPixels; y++)
        //        {
        //            byte* currentLine = ptrFirstPixel + (y * maskedData.Stride);
        //            byte* inputImageCurrentLine = ptrInputPixcel + (y * inputBitmapData.Stride);
        //            byte* newImageCurrentLine = ptrNewImagePixcel + (y * newImageData.Stride);

        //            for (var x = 0; x < widthInBytes; x = x + bytesPerPixel)
        //            {
        //                int maskBlue = currentLine[x];
        //                int maskGreen = currentLine[x + 1];
        //                int maskRed = currentLine[x + 2];
        //                int maskA = currentLine[x + 3];

        //                if (maskBlue == 255 && maskGreen == 0 && maskRed == 255 && maskA == 255)
        //                {
        //                    newImageCurrentLine[x] = 255;
        //                    newImageCurrentLine[x + 1] = 255;
        //                    newImageCurrentLine[x + 2] = 255;
        //                    newImageCurrentLine[x + 3] = 0;
        //                }
        //                else
        //                {
        //                    newImageCurrentLine[x] = inputImageCurrentLine[x];
        //                    newImageCurrentLine[x + 1] = inputImageCurrentLine[x + 1];
        //                    newImageCurrentLine[x + 2] = inputImageCurrentLine[x + 2];
        //                    newImageCurrentLine[x + 3] = inputImageCurrentLine[x + 3];
        //                }
        //            }
        //        }
        //        masked.UnlockBits(maskedData);
        //        copyTo.UnlockBits(newImageData);
        //        inputBitmap.UnlockBits(inputBitmapData);
        //    }
        //    return copyTo;
        //}

        public static Bitmap ConvertTo32Argb(Bitmap img)
        {
            return ConvertToFormat(img, PixelFormat.Format32bppArgb);
        }

        public static Bitmap ConvertToFormat24BppRgb(Bitmap img)
        {
            return ConvertToFormat(img, PixelFormat.Format24bppRgb);
        }

        private static Bitmap ConvertToFormat(Image img, PixelFormat pixcelFormat)
        {
            var bmp = new Bitmap(img.Width, img.Height, pixcelFormat);

            using (var gr = Graphics.FromImage(bmp))
            {
                gr.DrawImage(img, new Rectangle(0, 0, img.Width, img.Height));
            }
            return bmp;
        }
    }

    public class LockBitmap
    {
        readonly Bitmap _source;
        IntPtr _iptr = IntPtr.Zero;
        BitmapData _bitmapData;

        public byte[] Pixels { get; set; }
        public int Width { get; private set; }
        public int Height { get; private set; }

        public const int Step = 4;

        public LockBitmap(Bitmap source)
        {
            _source = source;
        }

        public void LockBits()
        {
            Width = _source.Width;
            Height = _source.Height;
            var pixelCount = Width * Height;
            _bitmapData = _source.LockBits(new Rectangle(0, 0, Width, Height), ImageLockMode.ReadWrite, _source.PixelFormat);
            Pixels = new byte[pixelCount * Step];
            _iptr = _bitmapData.Scan0;

            Marshal.Copy(_iptr, Pixels, 0, Pixels.Length);
        }

        public void UnlockBits()
        {
            _source.UnlockBits(_bitmapData);
        }

        public Color GetPixel(int x, int y)
        {
            var i = ((y * Width) + x) * Step;
            var b = Pixels[i];
            var g = Pixels[i + 1];
            var r = Pixels[i + 2];
            var a = Pixels[i + 3]; // a

            return Color.FromArgb(a, r, g, b);
        }
    }

    public class ImageUrlsSlide
    {
        [XmlElement("ImageUrl")]
        public string ImageUrl { get; set; }

        [XmlElement("Type")]
        public int Type { get; set; }

        [XmlElement("DisplayOrder")]
        public int DisplayOrder { get; set; }
    }

    public class FileUrls
    {
        [XmlElement("FileUrl")]
        public string FileUrl { get; set; }

        [XmlElement("Type")]
        public int Type { get; set; }
    }
}