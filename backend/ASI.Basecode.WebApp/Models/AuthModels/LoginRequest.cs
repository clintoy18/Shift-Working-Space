using ASI.Basecode.Data.Models;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Models
{
    public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
}
