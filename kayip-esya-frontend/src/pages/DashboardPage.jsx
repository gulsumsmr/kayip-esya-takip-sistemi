import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import dayjs from "dayjs";

import { useAuth } from "../context/AuthContext";
import {
  getKayipEsyalar,
  createKayipEsya,
  createTeslimat,
} from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import MainContent from "../components/layout/MainContent";
import YeniEsyaDialog from "../components/YeniEsyaDialog";
import TeslimatYapDialog from "../components/TeslimatYapDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const drawerWidth = 240;

function DashboardPage() {
  const { user, logoutUser: logout } = useAuth();
  const navigate = useNavigate();

  // ===== UI STATE =====
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState("beklemede");

  // ===== DATA STATE =====
  const [allKayipEsyalar, setAllKayipEsyalar] = useState([]);
  const [filteredKayipEsyalar, setFilteredKayipEsyalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== 🔥 FİLTRE STATE =====
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    search: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ===== DIALOG STATE =====
  const [esyaDialogOpen, setEsyaDialogOpen] = useState(false);
  const [teslimDialogOpen, setTeslimDialogOpen] = useState(false);
  const [selectedEsya, setSelectedEsya] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ===== DATA FETCH =====
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getKayipEsyalar();
      const list = response.data?.$values || response.data || [];
      setAllKayipEsyalar(list);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
      setError("Veriler yüklenirken hata oluştu.");
      setAllKayipEsyalar([]);
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = allKayipEsyalar;

    if (currentView === "beklemede") {
      filtered = filtered.filter((e) => e.durum?.toLowerCase() === "beklemede");
    }
    if (currentView === "teslimedildi") {
      filtered = filtered.filter(
        (e) => e.durum?.toLowerCase() === "teslim edildi"
      );
    }

    // BAŞLANGIÇ TARİHİ
    if (filters.startDate) {
      filtered = filtered.filter((e) =>
        dayjs(e.bulunduguTarih).isAfter(dayjs(filters.startDate).startOf("day"))
      );
    }

    // BİTİŞ TARİHİ
    if (filters.endDate) {
      filtered = filtered.filter((e) =>
        dayjs(e.bulunduguTarih).isBefore(dayjs(filters.endDate).endOf("day"))
      );
    }

    // ARAMA
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.aciklama?.toLowerCase().includes(q) ||
          e.bulanKisi?.toLowerCase().includes(q) ||
          e.bulunduguYer?.toLowerCase().includes(q)
      );
    }

    setFilteredKayipEsyalar(filtered);
  }, [filters, currentView, allKayipEsyalar]);

  // ===== SIDEBAR =====
  const handleMenuClick = (view) => {
    if (view === "esya-ekle") {
      setEsyaDialogOpen(true);
      return;
    }
    setCurrentView(view);
  };

  // ===== TESLİMAT FLOW =====
  const handleOpenTeslimDialog = (esya) => {
    setSelectedEsya(esya);
    setTeslimDialogOpen(true);
  };

  const handleCloseTeslimDialog = () => {
    setSelectedEsya(null);
    setTeslimDialogOpen(false);
  };

  const handleConfirmTeslimat = async (teslimatData) => {
    await createTeslimat({
      ...teslimatData,
      esyaId: selectedEsya.esyaId,
    });
    handleCloseTeslimDialog();
    fetchData();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        currentView={currentView}
        onMenuClick={handleMenuClick}
        logout={logout}
        user={user}
      />

      <MainContent
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        kayipEsyalar={filteredKayipEsyalar}
        loading={loading}
        error={error}
        fetchData={fetchData}
        isBeklemede={currentView === "beklemede"}
        user={user}
        onTeslimEt={handleOpenTeslimDialog}
        // FİLTRE PROPLARI
        filters={filters}
        setFilters={setFilters}
      />

      {/* ===== YENİ EŞYA ===== */}
      <YeniEsyaDialog
        open={esyaDialogOpen}
        onClose={() => setEsyaDialogOpen(false)}
        onSave={async (formData) => {
          try {
            await createKayipEsya(formData);
            setEsyaDialogOpen(false);
            fetchData();

            setSnackbar({
              open: true,
              message: "Eşya başarıyla eklendi",
              severity: "success",
            });
          } catch (err) {
            setSnackbar({
              open: true,
              message: "Eşya eklenirken hata oluştu",
              severity: "error",
            });
          }
        }}
      />

      {/* ===== TESLİMAT ===== */}
      {selectedEsya && (
        <TeslimatYapDialog
          open={teslimDialogOpen}
          onClose={handleCloseTeslimDialog}
          onSave={handleConfirmTeslimat}
          kayipEsya={selectedEsya}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardPage;
