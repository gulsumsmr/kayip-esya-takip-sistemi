using KayipEsyaTakip.API.Data;
using KayipEsyaTakip.API.DTOs;
using KayipEsyaTakip.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KayipEsyaTakip.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // 1. Kullanıcı veritabanında var mı?
            if (await _context.Kullanicilar.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            // 2. Şifreyi Hash'le (Asla düz metin kaydetme!)
            string sifreHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Sifre);

            // 3. Rolü doğrula
            string rol = registerDto.Rol?.ToLower() == "personel" ? "Personel" : "Kullanici";

            // 4. Yeni kullanıcı oluştur
            var kullanici = new Kullanici
            {
                Email = registerDto.Email.ToLower(),
                SifreHash = sifreHash,
                Rol = rol
            };

            // 5. Veritabanına kaydet
            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync();

            // 6. Başarılı kayıt sonrası (isteğe bağlı olarak) token oluşturup dön
            return new UserDto
            {
                Email = kullanici.Email,
                Rol = kullanici.Rol,
                Token = CreateToken(kullanici)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // 1. Kullanıcıyı bul
            var kullanici = await _context.Kullanicilar
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            // 2. Kullanıcı yoksa veya şifre yanlışsa
            if (kullanici == null || !BCrypt.Net.BCrypt.Verify(loginDto.Sifre, kullanici.SifreHash))
            {
                return Unauthorized("Geçersiz email veya şifre.");
            }

            // 3. Başarılı giriş. Token oluştur ve dön.
            return new UserDto
            {
                Email = kullanici.Email,
                Rol = kullanici.Rol,
                Token = CreateToken(kullanici)
            };
        }

        // --- Token Oluşturma Metodu ---
        private string CreateToken(Kullanici kullanici)
        {
            var claims = new List<Claim>
            {
                // Token içinde bu bilgileri saklayacağız
                new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
                new Claim(ClaimTypes.Name, kullanici.Email),
                new Claim(ClaimTypes.Role, kullanici.Rol)
            };

            // appsettings.json'dan gizli anahtarı al
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Key").Value));

            // Anahtarla token'ı imzala
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(30), // Token 7 gün geçerli olsun
                SigningCredentials = creds,
                Issuer = _configuration.GetSection("Jwt:Issuer").Value,
                Audience = _configuration.GetSection("Jwt:Audience").Value
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}

