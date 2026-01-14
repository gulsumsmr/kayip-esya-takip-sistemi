import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/sultanagazilogo.png";

import {
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [kullaniciTipi, setKullaniciTipi] = useState("personel");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (_event, yeniTip) => {
    if (yeniTip !== null) setKullaniciTipi(yeniTip);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !sifre) {
      setError("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }

    const credentials = {
      Email: email,
      Sifre: sifre,
    };

    try {
      await loginUser(credentials);
      navigate("/");
    } catch (err) {
      setError("E-posta veya şifre hatalı.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
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
        <Box sx={{ 
          width: "100%", 
          maxWidth: 450,
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}>
          <img src={logo} alt="Logo" style={{ width: 100, marginBottom: 20 }} />

          <Typography variant="h5" fontWeight="bold">
            Hoş Geldiniz!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <ToggleButtonGroup
            value={kullaniciTipi}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{ my: 3 }}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "GİRİŞ YAP"}
            </Button>

            <Box sx={{ mt: 2, width: "100%", textAlign: "left" }}>
              <Typography variant="body2" color="text.secondary">
                Hesabınız yok mu?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/register")}
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
                  Kayıt Ol
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
