using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AmuLab.WebApp.Helper
{
    public class ValidationHelper
    {
        public static ObjectValidationResult ValidateObject<T>(T entity)
        where T : class
        {
            return new ObjectValidator<T>().Validate(entity);
        }
    }

    public class ObjectValidationResult
    {
        public IList<ValidationResult> Errors { get; private set; }
        public bool HasError
        {
            get { return Errors.Count > 0; }
        }

        public ObjectValidationResult(IList<ValidationResult> errors = null)
        {
            Errors = errors ?? new List<ValidationResult>();
        }
    }

    public class ObjectValidator<T> where T : class
    {
        public ObjectValidationResult Validate(T entity)
        {
            var validationResults = new List<ValidationResult>();
            var vc = new ValidationContext(entity, null, null);
            var isValid = Validator.TryValidateObject
                    (entity, vc, validationResults, true);

            return new ObjectValidationResult(validationResults);
        }
    }


}