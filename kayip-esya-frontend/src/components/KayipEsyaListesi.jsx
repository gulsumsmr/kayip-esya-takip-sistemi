import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";

import dayjs from "dayjs";
import "dayjs/locale/tr";

import { deleteKayipEsya } from "../services/api";

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
    <Box sx={{ mr: 1.5, color: "text.secondary" }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value || "Belirtilmemiş"}
      </Typography>
    </Box>
  </Box>
);

function KayipEsyaListesi({
  kayipEsyalar,
  loading,
  error,
  fetchData,
  isBeklemede,
  user,
  onTeslimEt,
}) {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedEsya, setSelectedEsya] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDetailDialog = (esya) => {
    setSelectedEsya(esya);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedEsya(null);
  };

  const handleOpenDeleteDialog = (esya) => {
    setItemToDelete(esya);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteKayipEsya(itemToDelete.esyaId);

      setSnackbar({
        open: true,
        message: "Eşya başarıyla silindi",
        severity: "success",
      });

      handleCloseDeleteDialog();
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Silme işlemi sırasında hata oluştu",
        severity: "error",
      });
    }
  };

  const getChipProps = (durum) => {
    if (durum?.toLowerCase() === "beklemede") {
      return {
        label: "Beklemede",
        color: "warning",
        icon: <HelpOutlineIcon />,
      };
    }
    if (durum?.toLowerCase() === "teslim edildi") {
      return {
        label: "Teslim Edildi",
        color: "success",
        icon: <CheckCircleOutlineIcon />,
      };
    }
    return {
      label: durum || "Bilinmiyor",
      color: "default",
      icon: <InfoIcon />,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!kayipEsyalar || kayipEsyalar.length === 0) {
    return (
      <Typography color="text.secondary">
        Gösterilecek kayıt bulunamadı.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <TableCell>Eşya</TableCell>
              <TableCell>Bulan Kişi</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Yer</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">Detay</TableCell>

              {user?.role === "Personel" && (
                <>
                  {isBeklemede && <TableCell align="center">Teslim</TableCell>}
                  <TableCell align="center">Sil</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {kayipEsyalar.map((row) => {
              const chip = getChipProps(row.durum);
              return (
                <TableRow key={row.esyaId} hover>
                  <TableCell>{row.aciklama}</TableCell>
                  <TableCell>{row.bulanKisi}</TableCell>
                  <TableCell>
                    {dayjs(row.bulunduguTarih).format("DD.MM.YYYY")}
                  </TableCell>
                  <TableCell>{row.bulunduguYer}</TableCell>

                  <TableCell>
                    <Chip
                      label={chip.label}
                      icon={chip.icon}
                      color={chip.color}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDetailDialog(row)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>

                  {user?.role === "Personel" && (
                    <>
                      {isBeklemede && (
                        <TableCell align="center">
                          <IconButton
                            color="success"
                            onClick={() => onTeslimEt(row)}
                          >
                            <HandshakeIcon />
                          </IconButton>
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isBeklemede ? "Eşya Detayı" : "Teslimat Detayı"}
          <IconButton onClick={handleCloseDetailDialog} sx={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedEsya && (
            <Stack spacing={2}>
              {isBeklemede ? (
                <>
                  <InfoRow
                    icon={<CategoryIcon />}
                    label="Açıklama"
                    value={selectedEsya.aciklama}
                  />
                  <InfoRow
                    icon={<PersonIcon />}
                    label="Bulan Kişi"
                    value={selectedEsya.bulanKisi}
                  />
                  <InfoRow
                    icon={<LocationOnIcon />}
                    label="Bulunduğu Yer"
                    value={selectedEsya.bulunduguYer}
                  />
                  <InfoRow
                    icon={<CalendarTodayIcon />}
                    label="Bulunduğu Tarih"
                    value={dayjs(selectedEsya.bulunduguTarih).format(
                      "DD MMMM YYYY"
                    )}
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    icon={<CategoryIcon />}
                    label="Eşya"
                    value={selectedEsya.aciklama}
                  />
                  <InfoRow
                    icon={<PersonIcon />}
                    label="Teslim Alan"
                    value={selectedEsya.teslimAlanAdSoyad}
                  />
                  <InfoRow
                    icon={<PersonIcon />}
                    label="Teslim Eden Personel"
                    value={selectedEsya.teslimEdenPersonel}
                  />
                  <InfoRow
                    icon={<CalendarTodayIcon />}
                    label="Teslim Tarihi"
                    value={dayjs(selectedEsya.teslimTarihi).format(
                      "DD MMMM YYYY"
                    )}
                  />
                </>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetailDialog} variant="contained">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== SİLME ONAY ===== */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu eşyayı silmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>İptal</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== SNACKBAR ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default KayipEsyaListesi;
