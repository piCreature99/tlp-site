import { useScrollTrigger, Zoom, Fab, Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollTop({ children }: { children: React.ReactElement }) {
  // This hook returns 'true' if the user has scrolled down past 100px
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}