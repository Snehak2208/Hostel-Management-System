import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  MeetingRoom as RoomIcon,
  People as StudentIcon,
  Payment as PaymentIcon,
  Dashboard as DashboardIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          pt: 8
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/rooms">
          <ListItemIcon><RoomIcon /></ListItemIcon>
          <ListItemText primary="Rooms" />
        </ListItem>
        <ListItem button component={Link} to="/students">
          <ListItemIcon><StudentIcon /></ListItemIcon>
          <ListItemText primary="Students" />
        </ListItem>
        <ListItem button component={Link} to="/payments">
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Navbar;