using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KayipEsyaTakip.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "KAYIP_ESYA_APP");

            migrationBuilder.CreateTable(
                name: "KayipEsyalar",
                schema: "KAYIP_ESYA_APP",
                columns: table => new
                {
                    EsyaId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Aciklama = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    EsyaTuru = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: true),
                    BulanKisi = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    BulunduguTarih = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    BulunduguYer = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    TeslimAlinanBirim = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: true),
                    TeslimAlanPersonel = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: true),
                    Durum = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false, defaultValueSql: "SYSDATE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KayipEsyalar", x => x.EsyaId);
                });

            migrationBuilder.CreateTable(
                name: "Teslimatlar",
                schema: "KAYIP_ESYA_APP",
                columns: table => new
                {
                    TeslimatId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    TeslimAlanAdSoyad = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    TeslimAlanTc = table.Column<string>(type: "NVARCHAR2(11)", maxLength: 11, nullable: true),
                    TeslimTarihi = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false, defaultValueSql: "SYSDATE"),
                    TeslimEdenPersonel = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: true),
                    EsyaId = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    KayipEsyaId = table.Column<int>(type: "NUMBER(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teslimatlar", x => x.TeslimatId);
                    table.ForeignKey(
                        name: "FK_Teslimatlar_KayipEsyalar_EsyaId",
                        column: x => x.EsyaId,
                        principalSchema: "KAYIP_ESYA_APP",
                        principalTable: "KayipEsyalar",
                        principalColumn: "EsyaId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Teslimatlar_EsyaId",
                schema: "KAYIP_ESYA_APP",
                table: "Teslimatlar",
                column: "EsyaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Teslimatlar",
                schema: "KAYIP_ESYA_APP");

            migrationBuilder.DropTable(
                name: "KayipEsyalar",
                schema: "KAYIP_ESYA_APP");
        }
    }
}
