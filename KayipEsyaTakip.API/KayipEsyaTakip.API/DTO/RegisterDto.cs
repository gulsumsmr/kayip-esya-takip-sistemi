using System.ComponentModel.DataAnnotations;

namespace KayipEsyaTakip.API.DTOs
{
    // Kayıt (Register) formu için veri taşıma objesi
    public class RegisterDto
    {
        [Required(ErrorMessage = "Email alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre alanı zorunludur.")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string Sifre { get; set; }

        [Required(ErrorMessage = "Rol alanı zorunludur.")]
        public string Rol { get; set; } // "Personel" veya "Kullanici"
    }
}

