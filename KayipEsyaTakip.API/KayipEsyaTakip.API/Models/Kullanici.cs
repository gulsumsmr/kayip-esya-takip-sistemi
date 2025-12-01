using System.ComponentModel.DataAnnotations;

namespace KayipEsyaTakip.API.Models
{
    public class Kullanici
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)] // Hash'lenmiş şifre uzun olacaktır
        public string SifreHash { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Rol { get; set; } = "Kullanici"; // Varsayılan rol "Kullanici"
    }
}
