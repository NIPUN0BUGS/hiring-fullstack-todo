import { Box, Stack, Typography } from '@mui/material';
import { CheckCheck } from 'lucide-react';

export default function TopBar() {
  return (
    <Box component="header" className="topbar">
      <Stack component="a" href="#top" direction="row" alignItems="center" spacing={1.1} className="brand" aria-label="Daymark home">
        <Box className="brand-mark"><CheckCheck size={19} strokeWidth={2.5} /></Box>
        <Typography component="span" variant="h6" sx={{ fontWeight: 800, letterSpacing: '-1px', color: '#172840' }}>
          daymark<span className="brand-dot">.</span>
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Box className="status-dot" />
        <Typography variant="caption" color="text.secondary">Your personal task space</Typography>
      </Stack>
    </Box>
  );
}
