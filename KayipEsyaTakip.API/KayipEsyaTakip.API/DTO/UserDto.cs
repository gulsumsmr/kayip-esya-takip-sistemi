namespace KayipEsyaTakip.API.DTOs
{
    // Başarılı giriş/kayıt sonrası React'e geri gönderilecek cevap objesi
    public class UserDto
    {
        public string Email { get; set; }
        public string Rol { get; set; }
        public string Token { get; set; }
    }
}

