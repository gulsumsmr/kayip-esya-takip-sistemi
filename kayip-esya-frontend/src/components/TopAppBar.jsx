import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import YeniEsyaDialog from "./YeniEsyaDialog";
import { createKayipEsya } from "../services/api";

function TopAppBar({ handleDrawerToggle, fetchData, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = async (formData) => {
    try {
      await createKayipEsya(formData);

      setDialogOpen(false);
      fetchData();

      setSnackbar({
        open: true,
        message: "Eşya başarıyla eklendi",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Eşya eklenirken hata oluştu",
        severity: "error",
      });
    }
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h5" fontWeight="bold">
              Eşya Listesi
            </Typography>
          </Box>

          {user?.role === "Personel" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => setDialogOpen(true)}
            >
              Yeni Eşya
            </Button>
          )}
        </Box>

        <Divider />
      </Box>

      <YeniEsyaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default TopAppBar;
