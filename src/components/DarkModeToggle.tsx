import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun

export function DarkModeToggle({ toggleColorMode }: { toggleColorMode: () => void }) {
  const theme = useTheme();

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}