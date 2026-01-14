// src/components/layout/MainContent.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Divider
} from '@mui/material';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import TopAppBar from '../TopAppBar';
import KayipEsyaListesi from '../KayipEsyaListesi';

function MainContent({
  drawerWidth,
  handleDrawerToggle,
  kayipEsyalar,
  loading,
  error,
  fetchData,
  isBeklemede,
  user,
  onTeslimEt,

  // 🔥 FİLTRE PROPLARI (DashboardPage’den geliyor)
  filters,
  setFilters
}) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        backgroundColor: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      {/* ===== TOP BAR ===== */}
      <TopAppBar
        handleDrawerToggle={handleDrawerToggle}
        fetchData={fetchData}
        user={user}
      />

      <Paper sx={{ p: 3, borderRadius: 2, mt: 3, flexGrow: 1 }}>
        
        {/* ===== FİLTRE ALANI ===== */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Filtreleme
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Başlangıç Tarihi"
                value={filters.startDate}
                onChange={(value) =>
                  setFilters(prev => ({ ...prev, startDate: value }))
                }
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Bitiş Tarihi"
                value={filters.endDate}
                onChange={(value) =>
                  setFilters(prev => ({ ...prev, endDate: value }))
                }
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                fullWidth
                label="Ara (Eşya / Kişi / Yer)"
                value={filters.search}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Divider sx={{ mb: 2 }} />

        {/* ===== BAŞLIK ===== */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {isBeklemede ? 'Beklemedeki Eşyalar' : 'Teslim Edilen Eşyalar'}
        </Typography>

        {/* ===== LİSTE ===== */}
        <KayipEsyaListesi
          kayipEsyalar={kayipEsyalar}
          loading={loading}
          error={error}
          fetchData={fetchData}
          isBeklemede={isBeklemede}
          user={user}
          onTeslimEt={onTeslimEt}
        />
      </Paper>
    </Box>
  );
}

export default MainContent;
