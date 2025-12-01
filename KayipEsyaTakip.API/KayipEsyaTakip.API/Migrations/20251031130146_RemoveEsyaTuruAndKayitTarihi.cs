using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KayipEsyaTakip.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEsyaTuruAndKayitTarihi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KayipEsyaId",
                schema: "KAYIP_ESYA_APP",
                table: "Teslimatlar");

            migrationBuilder.DropColumn(
                name: "EsyaTuru",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar");

            migrationBuilder.DropColumn(
                name: "KayitTarihi",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KayipEsyaId",
                schema: "KAYIP_ESYA_APP",
                table: "Teslimatlar",
                type: "NUMBER(10)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EsyaTuru",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar",
                type: "NVARCHAR2(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "KayitTarihi",
                schema: "KAYIP_ESYA_APP",
                table: "KayipEsyalar",
                type: "TIMESTAMP(7)",
                nullable: false,
                defaultValueSql: "SYSDATE");
        }
    }
}
