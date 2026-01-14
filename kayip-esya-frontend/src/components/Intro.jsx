import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Box } from "@mui/material";
import logo from "../assets/sultanagazilogo.png";
import "../styles/Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-container">
      <Box className="intro-content">
        <img src={logo} alt="Sultangazi Belediyesi" className="intro-logo" />

        <Typography className="intro-title">Sultangazi Belediyesi</Typography>

        <Typography className="intro-subtitle">
          Kayıp Eşya Yönetim Sistemi
        </Typography>

        <Box className="intro-loading">
          <CircularProgress size={28} sx={{ color: "#fff" }} />
          <Typography className="intro-loading-text">
            Sistem Yükleniyor...
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
