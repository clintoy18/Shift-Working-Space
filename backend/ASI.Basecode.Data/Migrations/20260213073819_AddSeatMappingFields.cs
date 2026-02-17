using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ASI.Basecode.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSeatMappingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayLabel",
                table: "Seats",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeatCode",
                table: "Seats",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ZoneType",
                table: "Seats",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 1,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R1", 20m, "Floor 1, Central Area, Island Table 1, Left Side", "isl-1-L-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 2,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R2", 20m, "Floor 1, Central Area, Island Table 1, Left Side", "isl-1-L-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 3,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R3", 20m, "Floor 1, Central Area, Island Table 1, Right Side", "isl-1-R-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 4,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R4", 20m, "Floor 1, Central Area, Island Table 1, Right Side", "isl-1-R-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 5,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R5", 20m, "Floor 1, Central Area, Island Table 2, Left Side", "isl-2-L-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 6,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R6", 20m, "Floor 1, Central Area, Island Table 2, Left Side", "isl-2-L-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 7,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R7", 20m, "Floor 1, Central Area, Island Table 2, Right Side", "isl-2-R-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 8,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R8", 20m, "Floor 1, Central Area, Island Table 2, Right Side", "isl-2-R-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 9,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R9", 20m, "Floor 1, Central Area, Island Table 3, Left Side", "isl-3-L-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 10,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R10", 20m, "Floor 1, Central Area, Island Table 3, Left Side", "isl-3-L-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 11,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R11", 20m, "Floor 1, Central Area, Island Table 3, Right Side", "isl-3-R-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 12,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R12", 20m, "Floor 1, Central Area, Island Table 3, Right Side", "isl-3-R-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 13,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R13", 20m, "Floor 1, Central Area, Island Table 4, Left Side", "isl-4-L-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 14,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R14", 20m, "Floor 1, Central Area, Island Table 4, Left Side", "isl-4-L-1", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 15,
                columns: new[] { "DailyRate", "DisplayLabel", "HourlyRate", "Location", "SeatCode", "SeatType", "ZoneType" },
                values: new object[] { 160m, "R15", 20m, "Floor 1, Central Area, Island Table 4, Right Side", "isl-4-R-0", "Regular", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 16,
                columns: new[] { "DisplayLabel", "Location", "SeatCode", "ZoneType" },
                values: new object[] { "R16", "Floor 1, Central Area, Island Table 4, Right Side", "isl-4-R-1", "Island" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 17,
                columns: new[] { "DisplayLabel", "Location", "SeatCode", "ZoneType" },
                values: new object[] { "R20", "Floor 1, East Wall, Position 1", "wall-3-0", "Wall" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 18,
                columns: new[] { "DisplayLabel", "Location", "SeatCode", "ZoneType" },
                values: new object[] { "R21", "Floor 1, East Wall, Position 2", "wall-3-1", "Wall" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 19,
                columns: new[] { "DisplayLabel", "Location", "SeatCode", "ZoneType" },
                values: new object[] { "R22", "Floor 1, East Wall, Position 3", "wall-3-2", "Wall" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 20,
                columns: new[] { "DisplayLabel", "Location", "SeatCode", "ZoneType" },
                values: new object[] { "R23", "Floor 1, East Wall, Position 4", "wall-3-3", "Wall" });

            migrationBuilder.InsertData(
                table: "Seats",
                columns: new[] { "SeatId", "CreatedTime", "DailyRate", "DisplayLabel", "HourlyRate", "IsActive", "Location", "SeatCode", "SeatNumber", "SeatType", "Status", "UpdatedTime", "ZoneType" },
                values: new object[,]
                {
                    { 21, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R24", 20m, true, "Floor 1, East Wall, Position 5", "wall-3-4", "S-021", "Regular", "Available", null, "Wall" },
                    { 22, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R28", 20m, true, "Floor 1, North Wing, Regular Table, Left Side", "huddle-2-L-2", "S-022", "Regular", "Available", null, "Regular Table" },
                    { 23, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R29", 20m, true, "Floor 1, North Wing, Regular Table, Left Side", "huddle-2-L-1", "S-023", "Regular", "Available", null, "Regular Table" },
                    { 24, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R30", 20m, true, "Floor 1, North Wing, Regular Table, Left Side", "huddle-2-L-0", "S-024", "Regular", "Available", null, "Regular Table" },
                    { 25, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R25", 20m, true, "Floor 1, North Wing, Regular Table, Right Side", "huddle-2-R-2", "S-025", "Regular", "Available", null, "Regular Table" },
                    { 26, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R26", 20m, true, "Floor 1, North Wing, Regular Table, Right Side", "huddle-2-R-1", "S-026", "Regular", "Available", null, "Regular Table" },
                    { 27, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 160m, "R27", 20m, true, "Floor 1, North Wing, Regular Table, Right Side", "huddle-2-R-0", "S-027", "Regular", "Available", null, "Regular Table" },
                    { 28, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 240m, "C1", 30m, true, "Floor 1, South Wing, Focus Cubicle 1", "cube-0", "S-028", "Premium", "Available", null, "Cubicle" },
                    { 29, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 240m, "C2", 30m, true, "Floor 1, South Wing, Focus Cubicle 2", "cube-1", "S-029", "Premium", "Available", null, "Cubicle" },
                    { 30, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 240m, "C3", 30m, true, "Floor 1, South Wing, Focus Cubicle 3", "cube-2", "S-030", "Premium", "Available", null, "Cubicle" },
                    { 31, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 240m, "C4", 30m, true, "Floor 1, South Wing, Focus Cubicle 4", "cube-3", "S-031", "Premium", "Available", null, "Cubicle" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Seats_SeatCode",
                table: "Seats",
                column: "SeatCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_ZoneType",
                table: "Seats",
                column: "ZoneType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seats_SeatCode",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_ZoneType",
                table: "Seats");

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 31);

            migrationBuilder.DropColumn(
                name: "DisplayLabel",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "SeatCode",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "ZoneType",
                table: "Seats");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 1,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 400m, 50m, "Floor 1, Zone A", "VIP" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 2,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 400m, 50m, "Floor 1, Zone A", "VIP" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 3,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 400m, 50m, "Floor 1, Zone A", "VIP" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 4,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 400m, 50m, "Floor 1, Zone A", "VIP" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 5,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 400m, 50m, "Floor 1, Zone A", "VIP" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 6,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone B", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 7,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone B", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 8,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone B", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 9,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone B", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 10,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone B", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 11,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone C", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 12,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone C", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 13,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone C", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 14,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone C", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 15,
                columns: new[] { "DailyRate", "HourlyRate", "Location", "SeatType" },
                values: new object[] { 240m, 30m, "Floor 1, Zone C", "Premium" });

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 16,
                column: "Location",
                value: "Floor 1, Zone D");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 17,
                column: "Location",
                value: "Floor 1, Zone D");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 18,
                column: "Location",
                value: "Floor 1, Zone D");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 19,
                column: "Location",
                value: "Floor 1, Zone D");

            migrationBuilder.UpdateData(
                table: "Seats",
                keyColumn: "SeatId",
                keyValue: 20,
                column: "Location",
                value: "Floor 1, Zone D");
        }
    }
}
