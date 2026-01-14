import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/sultanagazilogo.png";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [kullaniciTipi, setKullaniciTipi] = useState("personel");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const rolMap = {
    personel: "Personel",
    vatandas: "Kullanici", // backend ne istiyorsa buna göre değiştir
  };

  const handleTypeChange = (_event, yeniTip) => {
    if (yeniTip !== null) setKullaniciTipi(yeniTip);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !sifre) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    const userInfo = {
      Email: email,
      Sifre: sifre,
      Rol: rolMap[kullaniciTipi],
    };

    try {
      await register(userInfo);
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Kayıt sırasında bir hata oluştu."
      );
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* SOL MAVİ PANEL — LOGIN İLE AYNI */}
      <Box
        sx={{
          flex: { xs: 0, md: 7 },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0944b1ff",
        }}
      >
        <img src={logo} alt="Logo" style={{ width: 180, marginBottom: 24 }} />
        <Typography variant="h4" color="white" fontWeight="bold">
          Sultangazi Belediyesi
        </Typography>
        <Typography variant="h6" color="white">
          Kayıp Eşya Yönetim Sistemi
        </Typography>
      </Box>

      {/* SAĞ FORM ALANI — LOGIN İLE AYNI */}
      <Box
        component={Paper}
        elevation={6}
        square
        sx={{
          flex: { xs: 1, md: 5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 450,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 100, marginBottom: 20 }} />

          <Typography variant="h5" fontWeight="bold">
            Kayıt Ol
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Lütfen kayıt bilgilerinizi giriniz.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <ToggleButtonGroup
            value={kullaniciTipi}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="personel">
              <BadgeIcon sx={{ mr: 1 }} /> Personel
            </ToggleButton>
            <ToggleButton value="vatandas">
              <PersonIcon sx={{ mr: 1 }} /> Vatandaş
            </ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="E-Posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Şifre"
              type={showPassword ? "text" : "password"}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5 }}
            >
              KAYIT OL
            </Button>

            <Box sx={{ mt: 2, width: "100%", textAlign: "left" }}>
              {" "}
              {/*  Sola yaslı */}
              <Typography variant="body2" color="text.secondary">
                Zaten hesabınız var mı?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textDecoration: "underline",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#0d47a1",
                    },
                  }}
                >
                  Giriş Yap
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
