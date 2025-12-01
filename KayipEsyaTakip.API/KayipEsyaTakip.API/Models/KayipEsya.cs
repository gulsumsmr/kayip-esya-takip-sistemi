using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KayipEsyaTakip.API.Models
{
    public class KayipEsya
    {
        [Key]
        public int EsyaId { get; set; }

        [Required]
        [StringLength(200)]
        public string Aciklama { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string BulanKisi { get; set; } = string.Empty;

        [Required]
        public DateTime BulunduguTarih { get; set; }

        [Required]
        [StringLength(100)]
        public string BulunduguYer { get; set; } = string.Empty;

        [StringLength(100)]
        public string? TeslimAlinanBirim { get; set; }

        [StringLength(100)]
        public string? TeslimAlanPersonel { get; set; }

        [Required]
        [StringLength(50)]
        public string Durum { get; set; } = "Beklemede";

        // === YENİ EKLENEN SATIR ===
        // Fotoğrafın sunucudaki adresini (URL) tutacak alan.
        // Nullable (?) yaptık, çünkü her eşyanın fotoğrafı olmak zorunda değil.
        public string? FotografUrl { get; set; }
        // === YENİ SATIR SONU ===

        public ICollection<Teslimat>? Teslimatlar { get; set; }
    }
}