using AntData.TKV.Helper;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using AmuLab.WebApp.Helper;

namespace AmuLab.WebApp.Controllers
{
    public class BaseController : Controller
    {
        protected readonly Security _security;
        public BaseController()
        {
            _security = new Security();
        }

        protected ValidationObject ValidationRequest(object request)
        {
            var validationResult = ValidationHelper.ValidateObject(request);
            if (validationResult.HasError)
            {
                return new ValidationObject
                {
                    Status = HttpValidationStatus.Invalid,
                    Message = validationResult.Errors[0].ErrorMessage
                };
            }           

            return new ValidationObject
            {
                Status = HttpValidationStatus.Valid
            };
        }
    }
    public class ValidationObject
    {
        public HttpValidationStatus Status { get; set; }
        public string Message { get; set; }
    }
}