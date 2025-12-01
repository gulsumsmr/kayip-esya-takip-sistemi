using Microsoft.EntityFrameworkCore;
using KayipEsyaTakip.API.Models; // <-- BU KESİNLİKLE OLMALI

namespace KayipEsyaTakip.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<KayipEsya> KayipEsyalar { get; set; }
        public DbSet<Teslimat> Teslimatlar { get; set; }
        public DbSet<Kullanici> Kullanicilar { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
             // Teslimat için varsayılan TeslimTarihi değeri
            modelBuilder.Entity<Teslimat>()
                .Property(t => t.TeslimTarihi)
                .HasDefaultValueSql("SYSDATE"); // Oracle için

            // Teslimat ile KayipEsya arasındaki ilişkiyi tanımla
            modelBuilder.Entity<Teslimat>()
                .HasOne(t => t.KayipEsya) // Bir Teslimat'ın bir KayipEsya'sı vardır
                .WithMany(k => k.Teslimatlar) // Bir KayipEsya'nın çok Teslimatı olabilir
                .HasForeignKey(t => t.EsyaId) // Teslimat tablosundaki foreign key
                .OnDelete(DeleteBehavior.Restrict); // Kayıp eşya silinirse teslimatlar kalmalı

            // Şemayı belirt
            modelBuilder.HasDefaultSchema("KAYIP_ESYA_APP");

            base.OnModelCreating(modelBuilder);
        }
    }
}