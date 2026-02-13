using ASI.Basecode.Data.Models;
using System.ComponentModel.DataAnnotations;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Models
{
    public class LoginRequest
    {
        [Required]
        [StringLength(100)]
        public string UserIdentifier { get; set; }  // generalize naming to accept both email and userId

        [Required]
        [StringLength(100)]
        public string Password { get; set; }
    }
}
