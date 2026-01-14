# 🏛️ Kayıp Eşya Takip Sistemi (Lost & Found Tracking System)

Bu proje, **Sultangazi Belediyesi Bilgi İşlem Müdürlüğü** staj dönemi kapsamında geliştirilmiş, belediyeye gelen vatandaşların unuttuğu eşyaların kayıt altına alınmasını, takibini ve sahibine teslim edilme süreçlerini dijital ortamda yönetmeyi sağlayan full-stack bir web uygulamasıdır.

<img width="1918" height="902" alt="Ekran görüntüsü 2026-01-14 221332" src="https://github.com/user-attachments/assets/e68743df-6529-43f1-b5b7-4d8c18ca0440" />


## 🚀 Özellikler

* **Dashboard & Özet:** Toplam, teslim edilen ve depoda bekleyen eşyaların anlık istatistikleri.
* **Dinamik Listeleme:** Kayıp eşyaların tarih, tür ve durumuna göre filtrelenebilir listesi.
* **Detaylı Görüntüleme:** Eşya durumuna göre ("Beklemede" veya "Teslim Edildi") değişen akıllı detay modalları.
* **Teslimat Yönetimi:** Eşyayı teslim alan kişinin (TCKN, Ad-Soyad, İmza vb.) sisteme kaydedilmesi.
* **Validasyonlu Formlar:** Hatalı veri girişini engelleyen, tarih ve veri tipi kontrollü giriş ekranları.
* **Modern Arayüz:** Material UI ile tasarlanmış responsive (mobil uyumlu) tasarım.

## 🛠️ Kullanılan Teknolojiler

### Backend (Sunucu Tarafı)
* **C# / ASP.NET Core Web API:** RESTful servis mimarisi.
* **Entity Framework Core:** ORM aracı ile veritabanı iletişimi.
* **LINQ:** Veri sorgulama işlemleri.

### Frontend (İstemci Tarafı)
* **React.js:** Bileşen tabanlı UI geliştirme.
* **Material UI (MUI):** Hazır tasarım kütüphanesi.
* **Axios:** HTTP istekleri ve API entegrasyonu.
* **Day.js:** Tarih formatlama işlemleri.

### Veritabanı
* **Oracle Database:** İlişkisel veri tabanı yönetimi.
* **PL/SQL:** Tablo, Sequence ve Trigger yapıları.

---

## 📂 Veritabanı Yapısı

Proje temel olarak iki ana tablo üzerinden çalışmaktadır:

1.  **KAYIP_ESYALAR:** Eşyanın cinsi, bulunduğu yer, bulan kişi ve anlık durumunu tutar.
2.  **TESLIMATLAR:** Teslim edilen eşyaların kime, ne zaman ve hangi personel tarafından teslim edildiğini tutar.

---

## ⚙️ Kurulum (Nasıl Çalıştırılır?)

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Gereksinimler
* Node.js (v14+)
* .NET SDK (6.0 veya üzeri)
* Oracle Database (Express veya Enterprise)

### 2. Backend Kurulumu
1.  `Backend` klasörüne gidin.
2.  `appsettings.json` dosyasını kendi Oracle veritabanı bilgilerinize göre düzenleyin:
    ```json
    "ConnectionStrings": {
      "OracleConnection": "User Id=KULLANICI_ADI;Password=SIFRE;Data Source=localhost:1521/xe"
    }
    ```
3.  Terminalden projeyi ayağa kaldırın:
    ```bash
    dotnet run
    ```

### 3. Frontend Kurulumu
1.  `Frontend` (veya proje adı) klasörüne gidin.
2.  Gerekli paketleri yükleyin:
    ```bash
    npm install
    ```
3.  Uygulamayı başlatın:
    ```bash
    npm start
    ```

---

## 📸 Ekran Görüntüleri
<img width="1911" height="879" alt="Ekran görüntüsü 2026-01-14 221024" src="https://github.com/user-attachments/assets/083348f3-30a3-4293-8c43-892f07f47f7d" />
<img width="1918" height="902" alt="Ekran görüntüsü 2026-01-14 221332 - Kopya" src="https://github.com/user-attachments/assets/d8b5cee4-af3a-4418-9fb4-d4a095dc00eb" />
<img width="1913" height="913" alt="Ekran görüntüsü 2026-01-14 223254" src="https://github.com/user-attachments/assets/bd205629-fece-461d-b925-b3ed817d1799" />
<img width="1919" height="895" alt="Ekran görüntüsü 2026-01-14 223314" src="https://github.com/user-attachments/assets/b6c7614b-1f37-4456-9093-0f9d2f666cd0" />
<img width="1917" height="887" alt="Ekran görüntüsü 2026-01-14 225123" src="https://github.com/user-attachments/assets/98aaa112-bde6-4c0e-b351-1c04ccd5451e" />
<img width="1917" height="903" alt="Ekran görüntüsü 2026-01-14 225212" src="https://github.com/user-attachments/assets/71fc2573-a7ec-4a71-b05a-ea693e27010b" />









---

## 👨‍💻 Geliştirici

**Ad Soyad:** [Senin Adın]  
**İletişim:** [LinkedIn Profilin veya E-mailin]

Bu proje **Sultangazi Belediyesi** staj çalışması olarak geliştirilmiştir.
