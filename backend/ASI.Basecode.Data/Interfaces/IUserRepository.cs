using ASI.Basecode.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IUserRepository
    {
        LoginResult AuthenticateUser(string userId, string password);
        string RegisterUser(RegisterUserViewModel model);
        User FetchUser(string userId);
        // public User FetchUserNoNullException(string userId);
        // void UpdateUser(RegisterUserViewModel model);
        public User? FetchUserEvenIfNull(string userId);
        void DeleteUser(string userId);
        void RegisterUserAdmin(RegisterUserAdminModel model);
        void UpdateUserAdmin(RegisterUserAdminModel model);
        public List<UserViewAdminModel> GetAllUsers();
        public bool UserExists(string userId);
        public List<UserViewAdminModel> GetRecentUsers(int count);
        public UserStatisticsViewModel GetUserStatistics();
        public List<User> GetUsersByRole(UserRoles role);
    }
}