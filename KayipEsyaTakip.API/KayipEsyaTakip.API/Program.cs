using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using KayipEsyaTakip.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// Veritabaný Baðlantýsý
// ==========================================================
var connectionString = builder.Configuration.GetConnectionString("OracleConnection");
IServiceCollection serviceCollection = builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseOracle(connectionString));

// ==========================================================
// CORS (Fotoðraf yüklemesi için AllowAnyOrigin olarak güncellenmiþti)
// ==========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Swagger servisleri
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// JWT ayarlarý
var jwtSection = builder.Configuration.GetSection("Jwt");
var issuer = jwtSection["Issuer"];
var audience = jwtSection["Audience"];
var key = jwtSection["Key"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5),
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                if (ctx.Exception is Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException)
                {
                    ctx.Response.Headers.Add("Token-Expired", "true");
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Swagger middleware'i
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

// === MÝDDLEWARE SIRALAMASI DÜZELTMESÝ ===
app.UseRouting(); // Önce Routing

app.UseCors("DevCors"); // Sonra CORS
app.UseStaticFiles(); // Sonra Statik Dosyalar (Resimler vb.)

app.UseAuthentication(); // Önce Kimlik Doðrulama
app.UseAuthorization(); // Sonra Yetkilendirme

// app.MapControllers(); // <-- BU SATIR YERÝNE
app.UseEndpoints(endpoints => 
{
    endpoints.MapControllers();
});
// === DÜZELTME SONU ===

app.Run();