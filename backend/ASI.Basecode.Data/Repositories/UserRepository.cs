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
            return GetDbSet<User>().FirstOrDefault(x =>
                !x.IsDeleted &&
                (x.Email == userId || x.UserId == userId));
        }

        public bool UserExists(string userId)
        {
            return GetDbSet<User>().Any(x =>
                !x.IsDeleted &&
                (x.Email == userId || x.UserId == userId));
        }

        public void AddUser(User user)
        {
            GetDbSet<User>().Add(user);
            UnitOfWork.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            GetDbSet<User>().Update(user);
            UnitOfWork.SaveChanges();
        }

        public void DeleteUserById(string userId)
        {
            GetDbSet<User>()
                .FirstOrDefault(u =>
                    u.UserId == userId &&
                    !u.IsDeleted)
                .IsDeleted = true;


            UnitOfWork.SaveChanges();
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
            return Context.Set<T>().Any(e =>
                EF.Property<string>(e, idPropertyName) == id &&
                !EF.Property<bool>(e, "IsDeleted")
                );
        }

    }
}