using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Bu using gerekli
using System.Text.Json.Serialization;

namespace KayipEsyaTakip.API.Models // BU KESİNLİKLE DOĞRU OLMALI
{
    public class Teslimat
    {
        [Key]
        public int TeslimatId { get; set; }

        [Required]
        [StringLength(100)]
        public string TeslimAlanAdSoyad { get; set; } = string.Empty;

        [StringLength(11)]
        public string? TeslimAlanTc { get; set; }

        [Required]
        public DateTime TeslimTarihi { get; set; } // = DateTime.Now; SİLDİK

        [StringLength(100)]
        public string? TeslimEdenPersonel { get; set; }

        [Required]
        public int EsyaId { get; set; } // Foreign Key

        [ForeignKey("EsyaId")] // YENİ DÜZENLEME: Foreign Key'i açıkça belirtiyoruz
        [JsonIgnore] // YENİ DÜZENLEME: Serialize ederken sonsuz döngüyü engeller.
        public KayipEsya? KayipEsya { get; set; } // Navigation property. Nullable olarak kalmalı.
    }
}