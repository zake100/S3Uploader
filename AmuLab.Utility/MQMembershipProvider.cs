using MQ.Core.Domain.Entity;
using TKV.DMS.Service;
using System;
using System.Web.Http;
using System.Web.Security;

namespace TKV.DMS.Utility
{
    public class MQMembershipProvider : MembershipProvider
    {
        private readonly IUserService _userService;

        public MQMembershipProvider(IUserService userService)
        {
            _userService = userService;
        }

        public MQMembershipProvider()
        {
            _userService = (IUserService)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(IUserService));
        }

        public override MembershipUser CreateUser(string username, string password, string email, string passwordQuestion,
            string passwordAnswer, bool isApproved, object providerUserKey, out MembershipCreateStatus status)
        {
            var args =
                new ValidatePasswordEventArgs(username, password, true);
            OnValidatingPassword(args);
            if (args.Cancel)
            {
                status = MembershipCreateStatus.InvalidPassword;
                return null;
            }
            if (RequiresUniqueEmail && GetUserNameByEmail(email) != string.Empty)
            {
                status = MembershipCreateStatus.DuplicateEmail;
                return null;
            }
            var user = GetUser(username, true);
            if (user == null)
            {
                var userObj = new UserEntity
                {
                    UserName = username,
                    Password = password,
                    EmailAddress = email,
                    IsActive = isApproved ? 1 : 0,
                    IsArchived = 0
                };
                _userService.Add(userObj);

                status = MembershipCreateStatus.Success;

                return GetUser(username, true);
            }
            status = MembershipCreateStatus.DuplicateUserName;
            return null;
        }

        public override bool ChangePasswordQuestionAndAnswer(string username, string password, string newPasswordQuestion,
            string newPasswordAnswer)
        {
            throw new NotImplementedException();
        }

        public override string GetPassword(string username, string answer)
        {
            throw new NotImplementedException();
        }

        public override bool ChangePassword(string username, string oldPassword, string newPassword)
        {
            return _userService.ChangePass(username, oldPassword, newPassword);
        }

        public override string ResetPassword(string username, string answer)
        {
            throw new NotImplementedException();
        }

        public override void UpdateUser(MembershipUser user)
        {
            throw new NotImplementedException();
        }

        public override bool ValidateUser(string username, string password)
        {
            var pass = EncriptFunctions.GeneratePassword(password);
            return _userService.Login(username, pass);
        }

        public override bool UnlockUser(string userName)
        {
            throw new NotImplementedException();
        }

        public override MembershipUser GetUser(object providerUserKey, bool userIsOnline)
        {
            throw new NotImplementedException();
        }

        public override MembershipUser GetUser(string username, bool userIsOnline)
        {
            var user = _userService.FindByUserName(username);
            if (user != null)
            {
                var memUser = new MembershipUser("MQMembershipProvider",
                    username, user.Id, user.EmailAddress,
                    string.Empty, string.Empty,
                    true, false, DateTime.MinValue,
                    DateTime.MinValue,
                    DateTime.MinValue,
                    DateTime.Now, DateTime.Now);
                return memUser;
            }
            return null;
        }

        public override string GetUserNameByEmail(string email)
        {
            var user = _userService.FindByEmail(email);
            if (user == null)
            {
                return null;
            }
            return user.UserName;
        }

        public override bool DeleteUser(string username, bool deleteAllRelatedData)
        {
            throw new NotImplementedException();
        }

        public override MembershipUserCollection GetAllUsers(int pageIndex, int pageSize, out int totalRecords)
        {
            throw new NotImplementedException();
        }

        public override int GetNumberOfUsersOnline()
        {
            throw new NotImplementedException();
        }

        public override MembershipUserCollection FindUsersByName(string usernameToMatch, int pageIndex, int pageSize, out int totalRecords)
        {
            throw new NotImplementedException();
        }

        public override MembershipUserCollection FindUsersByEmail(string emailToMatch, int pageIndex, int pageSize, out int totalRecords)
        {
            throw new NotImplementedException();
        }

        public override bool EnablePasswordRetrieval { get; }
        public override bool EnablePasswordReset { get; }
        public override bool RequiresQuestionAndAnswer { get; }
        public override string ApplicationName { get; set; }
        public override int MaxInvalidPasswordAttempts { get; }
        public override int PasswordAttemptWindow { get; }
        public override bool RequiresUniqueEmail { get { return false; } }
        public override MembershipPasswordFormat PasswordFormat { get; }
        public override int MinRequiredPasswordLength { get { return 6; } }
        public override int MinRequiredNonAlphanumericCharacters { get; }
        public override string PasswordStrengthRegularExpression { get; }
    }
}
