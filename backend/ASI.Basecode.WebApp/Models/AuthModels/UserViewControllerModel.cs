using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.WebApp.Models
{
    public class UserViewControllerModel
    {
        public string userId { get; set; }
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string role { get; set; }

    }
}