using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WP25G20.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamMemberTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedToTeamMemberId",
                table: "Tasks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssignedToTeamMemberId",
                table: "Tasks",
                column: "AssignedToTeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_Email",
                table: "TeamMembers",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_TeamMembers_AssignedToTeamMemberId",
                table: "Tasks",
                column: "AssignedToTeamMemberId",
                principalTable: "TeamMembers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_TeamMembers_AssignedToTeamMemberId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_AssignedToTeamMemberId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "AssignedToTeamMemberId",
                table: "Tasks");
        }
    }
}
