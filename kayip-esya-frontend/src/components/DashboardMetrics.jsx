import React from "react";
import { Box, Typography, Grid, Divider, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/tr";

function DashboardMetrics({ filters, onFilterChange }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
      >
        Tarihe Göre Filtrele
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
        <Grid container spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Başlangıç Tarihi"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(newValue) =>
                onFilterChange({
                  startDate: newValue ? newValue.toDate() : null,
                })
              }
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
              format="DD.MM.YYYY"
              disableFuture
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Bitiş Tarihi"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(newValue) =>
                onFilterChange({ endDate: newValue ? newValue.toDate() : null })
              }
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
              format="DD.MM.YYYY"
              disableFuture
            />
          </Grid>

          {}
        </Grid>
      </LocalizationProvider>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>{}</Box>
      <Divider sx={{ mb: 2 }} />
    </Box>
  );
}
export default DashboardMetrics;
