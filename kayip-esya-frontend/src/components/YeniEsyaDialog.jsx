import {
  useEffect,
  useMemo,
  forwardRef,
  useState, // <-- useState eklendi
} from "react";
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
  Alert, // <-- Alert eklendi
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceIcon from "@mui/icons-material/Place";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
dayjs.locale("tr");

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6C5CE7" },
    background: { default: "#f2f4f7", paper: "#f7f8fa" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
          border: "1px solid #e5e7eb",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 10 } },
    },
  },
});

const schema = z.object({
  aciklama: z
    .string()
    .trim()
    .min(1, "Açıklama zorunludur.")
    .max(500, "Maksimum 500 karakter."),
  bulanKisi: z.string().trim().min(1, "Bulan kişi zorunludur."),
  bulunduguTarih: z
    .any()
    .refine((v) => v && dayjs(v).isValid(), "Tarih zorunludur.")
    .transform((v) => dayjs(v).startOf("day")),
  bulunduguYer: z.string().trim().min(1, "Bulunduğu yer zorunludur."),
  teslimAlinanBirim: z.string().trim().min(1, "Birim zorunludur."),
  teslimAlanPersonel: z.string().trim().min(1, "Personel zorunludur."),
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const smallTextFieldSx = {
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -3px) scale(0.75)",
  },
};

export default function YeniEsyaDialog({ open, onClose, onSave }) {
  // === YENİ: Fotoğraf dosyasını tutmak için state ===
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  // ===============================================

  const defaultValues = useMemo(
    () => ({
      aciklama: "",
      bulanKisi: "",
      bulunduguTarih: dayjs().startOf("day"),
      bulunduguYer: "",
      teslimAlinanBirim: "",
      teslimAlanPersonel: "",
    }),
    []
  );

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setSelectedFile(null);
      setFileName("");
    }
  }, [open, reset, defaultValues]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  const submit = (values) => {
    const formData = new FormData();

    formData.append("Aciklama", values.aciklama);
    formData.append("BulanKisi", values.bulanKisi);
    formData.append(
      "BulunduguTarih",
      dayjs(values.bulunduguTarih).format("YYYY-MM-DD")
    );
    formData.append("BulunduguYer", values.bulunduguYer);
    formData.append("TeslimAlinanBirim", values.teslimAlinanBirim);
    formData.append("TeslimAlanPersonel", values.teslimAlanPersonel);

    if (selectedFile) {
      formData.append("fotograf", selectedFile);
    }

    onSave(formData);
  };

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
            <Stack direction="row" spacing={1.25} alignItems="center">
              <BadgeIcon />
              <Box>
                <Typography variant="h6">Yeni Kayıp Eşya Kaydı</Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <DialogContent>
            {/* Formu 'handleSubmit' ile sarmalıyoruz, ancak 'form' tag'ini
                DialogActions'daki butonu da içermesi için en dışa koymak daha iyi.
                MUI Dialog'da <form> tag'ini DialogContent'in içine koymak yerine
                Dialog'a 'component="form"' eklemek daha temizdir.
                Şimdilik böyle bırakalım, 'handleSubmit' butonda tetikleniyor.
            */}
            <Stack spacing={1.5}>
              {/* === YENİ: FOTOĞRAF YÜKLEME BUTONU === */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<FileUploadIcon />}
                sx={{ mt: 1 }}
              >
                Fotoğraf Yükle (İsteğe Bağlı)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {/* Seçilen dosyanın adını gösteren bilgilendirme kutusu */}
              {fileName && (
                <Alert severity="info" sx={{ mb: 1 }}>
                  Seçilen dosya: {fileName}
                </Alert>
              )}
              {/* ===================================== */}

              {/* Açıklama */}
              <Controller
                name="aciklama"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Açıklama"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={smallTextFieldSx}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Bulan Kişi */}
              <Controller
                name="bulanKisi"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Bulan Kişi"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={smallTextFieldSx}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Bulunduğu Tarih (sadece tarih olarak) */}
              <Controller
                name="bulunduguTarih"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Bulunduğu Tarih"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        required: true,
                        size: "small",
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                        InputLabelProps: { shrink: true },
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <ScheduleIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Bulunduğu Yer */}
              <Controller
                name="bulunduguYer"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Bulunduğu Yer"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={smallTextFieldSx}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Teslim Alınan Birim */}
              <Controller
                name="teslimAlinanBirim"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Teslim Alınan Birim"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={smallTextFieldSx}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Teslim Alan Personel */}
              <Controller
                name="teslimAlanPersonel"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Teslim Alan Personel"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={smallTextFieldSx}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon fontSize="small" />
                        </InputAdornment>
                      ),
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
              onClick={handleSubmit(submit)}
              startIcon={<CheckIcon />}
              disabled={!formState.isValid || formState.isSubmitting}
            >
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
