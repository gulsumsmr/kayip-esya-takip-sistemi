using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KayipEsyaTakip.API.Data;
using KayipEsyaTakip.API.Models;
using Microsoft.AspNetCore.Authorization; // <-- GÜVENLİK İÇİN EKLENDİ

namespace KayipEsyaTakip.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Personel")] // <-- DÜZELTME: Bu controller'a SADECE Personel erişebilir
    public class TeslimatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeslimatController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Teslimat
        // Tüm teslimatların listesini, ilişkili oldukları KayipEsya bilgileriyle birlikte döndürür.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teslimat>>> GetTeslimatlar()
        {
            return await _context.Teslimatlar.Include(t => t.KayipEsya).ToListAsync();
        }

        // GET: api/Teslimat/5
        // Belirtilen ID'ye sahip tek bir teslimatı döndürür.
        [HttpGet("{id}")]
        public async Task<ActionResult<Teslimat>> GetTeslimat(int id)
        {
            var teslimat = await _context.Teslimatlar
                .Include(t => t.KayipEsya)
                .FirstOrDefaultAsync(t => t.TeslimatId == id);

            if (teslimat == null)
            {
                return NotFound("Belirtilen ID'ye sahip teslimat bulunamadı.");
            }

            return teslimat;
        }

        // POST: api/Teslimat
        // Yeni bir teslimat oluşturur.
        [HttpPost]
        public async Task<ActionResult<Teslimat>> PostTeslimat(Teslimat teslimat)
        {
            var kayipEsya = await _context.KayipEsyalar.FindAsync(teslimat.EsyaId);
            if (kayipEsya == null)
            {
                return BadRequest("Geçersiz KayipEsyaId. İlişkili kayıp eşya bulunamadı.");
            }

            // Eşyanın durumunu "Teslim Edildi" olarak güncelle
            kayipEsya.Durum = "Teslim Edildi";

            _context.Teslimatlar.Add(teslimat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeslimat), new { id = teslimat.TeslimatId }, teslimat);
        }

        // DELETE: api/Teslimat/{id}
        // (Bu metod, kaydı "Beklemede"ye geri alır, kalıcı silmez)
        // (Frontend'imiz 'kalıcı silme' istediğin için bu metodu çağırmayacak,
        // ama API'de 'geri alma' yeteneği olarak durmasında sakınca yok)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeslimat(int id)
        {
            var teslimat = await _context.Teslimatlar
                .Include(t => t.KayipEsya) // KayıpEşya'yı da getir
                .FirstOrDefaultAsync(t => t.TeslimatId == id);

            if (teslimat == null)
            {
                return NotFound("Silinecek teslimat kaydı bulunamadı.");
            }

            // İlişkili KayıpEşya'nın durumunu "Beklemede" yap
            if (teslimat.KayipEsya != null)
            {
                teslimat.KayipEsya.Durum = "Beklemede";
            }

            _context.Teslimatlar.Remove(teslimat);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teslimat iptal edildi ve eşya 'Beklemede' durumuna geri döndü." });
        }
    }
}