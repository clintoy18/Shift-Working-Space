using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<User> GetUsers()
        {
            return GetDbSet<User>()
                .Where(u => !u.IsDeleted);
        }

        public User GetUser(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;
            }

            userId = userId.Trim();

            return GetDbSet<User>().FirstOrDefault(x =>
                !x.IsDeleted &&
                ((x.Email != null && x.Email.ToLower() == userId.ToLower()) ||
                 (x.UserId != null && x.UserId.ToLower() == userId.ToLower())));
        }

        public bool UserExists(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return false;
            }

            userId = userId.Trim();

            return GetDbSet<User>().Any(x =>
                !x.IsDeleted &&
                ((x.Email != null && x.Email.ToLower() == userId.ToLower()) ||
                 (x.UserId != null && x.UserId.ToLower() == userId.ToLower())));
        }

        public void AddUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            GetDbSet<User>().Add(user);
            UnitOfWork.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            GetDbSet<User>().Update(user);
            UnitOfWork.SaveChanges();
        }

        public void DeleteUserById(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            userId = userId.Trim();

            var user = GetDbSet<User>()
                .FirstOrDefault(u =>
                    u.UserId.ToLower() == userId.ToLower() &&
                    !u.IsDeleted);

            if (user != null)
            {
                user.IsDeleted = true;
                UnitOfWork.SaveChanges();
            }
        }

        public IQueryable<User> GetRecentUsers(int count)
        {
            return GetDbSet<User>()
                .Where(u => !u.IsDeleted)
                .OrderByDescending(u => u.CreatedTime)
                .Take(count);
        }

        public IQueryable<User> GetUsersByRole(UserRoles role)
        {
            return GetDbSet<User>()
                .Where(u =>
                    u.Role == role &&
                    !u.IsDeleted);
        }

        public bool IsIDExists<T>(string id, string idPropertyName) where T : class
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return false;
            }

            id = id.Trim();

            return Context.Set<T>().Any(e =>
                EF.Property<string>(e, idPropertyName).ToLower() == id.ToLower() &&
                !EF.Property<bool>(e, "IsDeleted"));
        }
    }
}