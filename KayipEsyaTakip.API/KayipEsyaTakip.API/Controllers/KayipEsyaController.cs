using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayipEsyaTakip.API.Data;
using KayipEsyaTakip.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting; // === YENİ === Dosya sistemi (wwwroot) için eklendi
using System.IO; // === YENİ === Dosya işlemleri (Path, FileStream) için eklendi

namespace KayipEsyaTakip.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KayipEsyaController : ControllerBase
    {
        private readonly AppDbContext _context;
        // === YENİ === Sunucudaki wwwroot klasörünün yolunu almak için eklendi
        private readonly IWebHostEnvironment _webHostEnvironment;

        // === GÜNCELLENDİ === Controller artık IWebHostEnvironment'ı da 'inject' ediyor
        public KayipEsyaController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment; // === YENİ ===
        }

        // GET: api/KayipEsya (Değişiklik yok)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KayipEsya>>> GetKayipEsyalar()
        {
            return await _context.KayipEsyalar
                                .Include(k => k.Teslimatlar)
                                .ToListAsync();
        }

        // GET: api/KayipEsya/5 (Değişiklik yok)
        [HttpGet("{id}")]
        public async Task<ActionResult<KayipEsya>> GetKayipEsya(int id)
        {
            var kayipEsya = await _context.KayipEsyalar
                                    .Include(k => k.Teslimatlar)
                                    .FirstOrDefaultAsync(k => k.EsyaId == id);

            if (kayipEsya == null)
            {
                return NotFound();
            }

            return kayipEsya;
        }

        // PUT: api/KayipEsya/5 (Değişiklik yok)
        [HttpPut("{id}")]
        [Authorize(Roles = "Personel")]
        public async Task<IActionResult> PutKayipEsya(int id, KayipEsya kayipEsya)
        {
            // (PUT metodunuzun içeriği aynı kaldı)
            if (id != kayipEsya.EsyaId)
            {
                return BadRequest();
            }
            _context.Entry(kayipEsya).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KayipEsyaExists(id)) { return NotFound(); }
                else { throw; }
            }
            return NoContent();
        }


        // === GÜNCELLENDİ ===
        // POST: api/KayipEsya
        // Bu metod artık JSON değil, 'multipart/form-data' kabul ediyor.
        [HttpPost]
        [Authorize(Roles = "Personel")]
        public async Task<ActionResult<KayipEsya>> PostKayipEsya(
            // [FromForm] sayesinde React'ten gelen form verilerini 'kayipEsya' objesine bind ediyoruz
            [FromForm] KayipEsya kayipEsya,
            // 'fotograf' anahtarıyla gönderilen dosyayı IFormFile olarak alıyoruz
            IFormFile? fotograf
        )
        {
            // 1. FOTOĞRAF YÜKLEME İŞLEMİ (Eğer fotoğraf varsa)
            if (fotograf != null && fotograf.Length > 0)
            {
                // wwwroot klasörünün yolunu al (örn: C:\projem\wwwroot)
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                // Resimleri kaydedeceğimiz klasör (örn: C:\projem\wwwroot\uploads)
                string uploadsPath = Path.Combine(wwwRootPath, "uploads");

                // Eğer 'uploads' klasörü yoksa oluştur
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Çakışmayı önlemek için rastgele bir dosya adı oluştur
                // (örn: 0a9f8b7c-1b1a-4b1a-8f0a-6a8b7c1d1e1f.jpg)
                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(fotograf.FileName);
                // Dosyanın kaydedileceği tam yol
                string filePath = Path.Combine(uploadsPath, uniqueFileName);

                // Dosyayı sunucuya kaydet
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await fotograf.CopyToAsync(fileStream);
                }

                // Veritabanına kaydedilecek URL'i ayarla (örn: /uploads/dosyaadi.jpg)
                kayipEsya.FotografUrl = "/uploads/" + uniqueFileName;
            }
            // (Eğer fotoğraf gelmediyse, kayipEsya.FotografUrl otomatik olarak null kalacak)

            // 2. VERİTABANI KAYIT İŞLEMİ
            _context.KayipEsyalar.Add(kayipEsya);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKayipEsya", new { id = kayipEsya.EsyaId }, kayipEsya);
        }
        // === GÜNCELLEME SONU ===


        // DELETE: api/KayipEsya/5 (Değişiklik yok)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Personel")]
        public async Task<IActionResult> DeleteKayipEsya(int id)
        {
            // (DELETE metodunuzun içeriği aynı kaldı)
            var kayipEsya = await _context.KayipEsyalar
                .Include(k => k.Teslimatlar)
                .FirstOrDefaultAsync(k => k.EsyaId == id);

            if (kayipEsya == null)
            {
                return NotFound();
            }

            // Önce ilişkili teslimatları sil
            if (kayipEsya.Teslimatlar != null && kayipEsya.Teslimatlar.Any())
            {
                _context.Teslimatlar.RemoveRange(kayipEsya.Teslimatlar);
            }

            // Sonra ana kayıp eşyayı sil
            _context.KayipEsyalar.Remove(kayipEsya);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool KayipEsyaExists(int id)
        {
            return _context.KayipEsyalar.Any(e => e.EsyaId == id);
        }
    }
}