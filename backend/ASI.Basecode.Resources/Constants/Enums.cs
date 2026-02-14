namespace ASI.Basecode.Resources.Constants
{
    /// <summary>
    /// Class for enumerated values
    /// </summary>
    public class Enums
    {
        /// <summary>
        /// API Result Status
        /// </summary>
        public enum Status
        {
            Success,
            Error,
            CustomErr,
        }

        /// <summary>
        /// Login Result
        /// </summary>
        public enum LoginResult
        {
            Success = 0,
            Failed = 1,
        }

        /// <summary>
        /// User Roles Enum
        /// </summary>
        public enum UserRole  // ✅ Changed from UserRoles to UserRole (singular)
        {
            Shifty,
            Cashier,
            Admin
        }

        // ✅ ADD NEW ENUMS for Shift Workspace
        /// <summary>
        /// Membership Type
        /// </summary>
        public enum MembershipType
        {
            Regular,
            Weekly,
            Monthly
        }

        /// <summary>
        /// Membership Status
        /// </summary>
        public enum MembershipStatus
        {
            Active,
            Expired,
            Suspended
        }

        /// <summary>
        /// Seat Type
        /// </summary>
        public enum SeatType
        {
            Regular,
            Premium,
            VIP
        }

        /// <summary>
        /// Seat Status
        /// </summary>
        public enum SeatStatus
        {
            Available,
            Reserved,
            Occupied,
            Maintenance
        }

        /// <summary>
        /// Reservation Status
        /// </summary>
        public enum ReservationStatus
        {
            Pending,
            Confirmed,
            Cancelled,
            Completed
        }

        /// <summary>
        /// Payment Status
        /// </summary>
        public enum PaymentStatus
        {
            Paid,
            Pending,
            Free
        }
    }
}