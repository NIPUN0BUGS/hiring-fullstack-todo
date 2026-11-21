import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';

export default function HeroSection({ progress }) {
  return (
    <Box component="section" className="hero" id="top">
      <Box className="hero-copy">
        <Stack direction="row" alignItems="center" spacing={0.8} className="eyebrow">
          <Sparkles size={14} />
          <span>A LITTLE MORE FOCUS</span>
        </Stack>
        <Typography component="h1" className="hero-title">
          Make room for<br /><span>what matters.</span>
        </Typography>
        <Typography component="p" className="hero-subtitle">
          One clear list. A calmer mind. Keep moving, one task at a time.
        </Typography>
      </Box>

      <Stack className="hero-progress" alignItems="center" spacing={1}>
        <Box className="progress-orbit" role="img" aria-label={`${progress}% of tasks completed`}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={3.2}
            sx={{ color: '#a9c5ff', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
          />
          <Box className="progress-center">
            <Typography component="strong">{progress}%</Typography>
            <Typography component="span">completed</Typography>
          </Box>
        </Box>
        <Typography component="span" className="progress-caption">Every step counts</Typography>
      </Stack>

      <Box className="hero-decoration hero-decoration-one" />
      <Box className="hero-decoration hero-decoration-two" />
    </Box>
  );
}
