import { useEffect, useMemo, forwardRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  InputAdornment,
  Slide,
  Alert,
  Snackbar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PersonIcon from "@mui/icons-material/Person";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import BadgeIcon from "@mui/icons-material/Badge";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import "dayjs/locale/tr";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

dayjs.locale("tr");

/* ===================== THEME ===================== */
const theme = createTheme({
  palette: {
    primary: { main: "#4CAF50" },
  },
  shape: { borderRadius: 14 },
});

/* ===================== VALIDATION ===================== */
const schema = z.object({
  teslimAlanAdSoyad: z.string().min(1, "Teslim alan kişi zorunludur"),
  teslimAlanTc: z.string().optional(),
  teslimEdenPersonel: z.string().min(1, "Teslim eden personel zorunludur"),
  teslimTarihi: z.any().refine((v) => dayjs(v).isValid(), "Tarih zorunludur"),
});

/* ===================== TRANSITION ===================== */
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ===================== COMPONENT ===================== */
export default function TeslimatYapDialog({
  open,
  onClose,
  onSave,
  kayipEsya,
  canDeliver = true,
}) {
  // ===================== HOOKLAR EN ÜSTE =====================
  const [successOpen, setSuccessOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      teslimAlanAdSoyad: "",
      teslimAlanTc: "",
      teslimEdenPersonel: "",
      teslimTarihi: dayjs(),
    }),
    []
  );

  const { control, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset, defaultValues]);

  const submit = async (values) => {
    await onSave({
      ...values,
      esyaId: kayipEsya?.esyaId,
      teslimTarihi: dayjs(values.teslimTarihi).format("YYYY-MM-DD"),
    });

    setSuccessOpen(true);
    reset(defaultValues);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // ===================== RENDER KOŞULU =====================
  if (!open || !kayipEsya) return null;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <BadgeIcon />
              <Box>
                <Typography variant="h6">Eşya Teslimatı</Typography>
                <Typography variant="body2" color="text.secondary">
                  Eşya: <strong>{kayipEsya.aciklama}</strong>
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {!canDeliver && (
                <Alert severity="warning">
                  Bu işlem için yetkiniz bulunmamaktadır.
                </Alert>
              )}

              <Controller
                name="teslimAlanAdSoyad"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Teslim Alan Kişi"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="teslimAlanTc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="T.C. Kimlik No (Opsiyonel)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FingerprintIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="teslimEdenPersonel"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Teslim Eden Personel"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="teslimTarihi"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Teslim Tarihi"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <ScheduleIcon />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} startIcon={<CloseIcon />}>
              İptal
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              disabled={!formState.isValid || !canDeliver}
              onClick={handleSubmit(submit)}
            >
              Teslimatı Onayla
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={successOpen}
          autoHideDuration={2500}
          onClose={() => setSuccessOpen(false)}
          message="Eşya başarıyla teslim edildi"
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
