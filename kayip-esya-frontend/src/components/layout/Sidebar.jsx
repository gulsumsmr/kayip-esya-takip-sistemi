import React from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // 🔥 YENİ
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  currentView,
  onMenuClick,
  logout,
  user, // 🔥 role kontrolü için
}) {
  const theme = useTheme();

  // 🔥 MENÜLER
  const menuItems = [
    { text: 'Eşya Listesi', icon: <InventoryIcon />, view: 'beklemede' },
    { text: 'Teslim Edilenler', icon: <HandshakeIcon />, view: 'teslimedildi' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'white' }}>
      
      {/* LOGO */}
      <Toolbar
        sx={{
          backgroundColor: '#032263',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Kayıp Eşya Takip
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* MENÜ */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.view} disablePadding>
            <ListItemButton
              selected={currentView === item.view}
              onClick={() => onMenuClick(item.view)}
              sx={{
                '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.1)' },
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* 🔥 EŞYA EKLE (SADECE PERSONEL) */}
        {user?.role === 'Personel' && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => onMenuClick('esya-ekle')}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Eşya Ekle" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* ÇIKIŞ */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* FOOTER */}
      <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          V1.0.0
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          ASP.NET + Oracle
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
          © 2025 Belediye Bilgi İşlem
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      
      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#032263',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#032263',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
