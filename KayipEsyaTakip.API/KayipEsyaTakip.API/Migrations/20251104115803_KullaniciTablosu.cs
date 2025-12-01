using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KayipEsyaTakip.API.Migrations
{
    /// <inheritdoc />
    public partial class KullaniciTablosu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                schema: "KAYIP_ESYA_APP",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Email = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    SifreHash = table.Column<string>(type: "NVARCHAR2(255)", maxLength: 255, nullable: false),
                    Rol = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kullanicilar",
                schema: "KAYIP_ESYA_APP");
        }
    }
}
