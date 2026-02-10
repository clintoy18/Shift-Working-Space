using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using System;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class RbacService : IRbacService
    {
        private readonly IUserRepository _userRepository;

        public RbacService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public UserRoles GetUserRole(string userId)
        {
            var user = _userRepository.GetUser(userId);

            if (user == null)
            {
                throw new ArgumentNullException(Resources.Messages.Errors.UserNotExist);
            }

            return user.Role;
        }

        public bool IsTeacher(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Cashier;
        }

        public bool IsStudent(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Shifty;
        }

        public bool IsAdmin(string userId)
        {
            var role = GetUserRole(userId);
            return role == UserRoles.Admin;
        }
    }
}