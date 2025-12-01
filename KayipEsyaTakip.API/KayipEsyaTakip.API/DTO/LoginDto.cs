using System.ComponentModel.DataAnnotations;

namespace KayipEsyaTakip.API.DTOs
{
    // Giriş (Login) formu için veri taşıma objesi
    public class LoginDto
    {
        [Required(ErrorMessage = "Email alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre alanı zorunludur.")]
        public string Sifre { get; set; }
    }
}

