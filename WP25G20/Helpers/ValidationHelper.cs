using System.ComponentModel.DataAnnotations;

namespace WP25G20.Helpers
{
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public static ValidationResult ValidateModel(object model)
        {
            var validationContext = new ValidationContext(model);
            var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
            
            bool isValid = Validator.TryValidateObject(model, validationContext, validationResults, true);
            
            return new ValidationResult
            {
                IsValid = isValid,
                Errors = validationResults.Select(vr => vr.ErrorMessage ?? "").ToList()
            };
        }
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
