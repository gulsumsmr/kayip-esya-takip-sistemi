using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KayipEsyaTakip.API.Migrations
{
    /// <inheritdoc />
    public partial class Add_FotografUrl_To_KayipEsya : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FotografUrl",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar",
                type: "NVARCHAR2(2000)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FotografUrl",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar");
        }
    }
}
