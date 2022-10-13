import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import  {withRouter } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

 const Header = props => {
  const { history } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null); 
  const [openNested, setOpenNested] = React.useState(null);

const clickIconButton = event => {
   setOpenNested(false);
   setAnchorEl2(event.currentTarget);
 };

 const clickFeatures = () => {
   setOpenNested(!openNested);
 };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const handleButtonClick = pageURL => {
  history.push(pageURL);
  setAnchorEl(null);
};


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={clickIconButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={() => {setAnchorEl2(null);setOpenNested(true);}}>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItem button onClick={() => handleButtonClick("/")}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={clickFeatures}>
                  <ListItemText primary="Business Units" />
                  {openNested ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openNested} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                  <ListItem button onClick={() => handleButtonClick("/Sales")}>
                      <ListItemText primary="Sales" />
                    </ListItem>
                  <ListItem button onClick={() => handleButtonClick("/Marketing")}>
                      <ListItemText primary="Marketing" />
                    </ListItem>
                    <ListItem button onClick={() => handleButtonClick("/ProjectDelivery")}>
                      <ListItemText primary="ProjectDelivery" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button  onClick={() => handleButtonClick("/About")}>
                  <ListItemText primary="About" />
                </ListItem>
              </List>
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Monolithic Application
          </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleButtonClick("/Profile")}>Profile</MenuItem>
                <MenuItem onClick={() => handleButtonClick("/Myaccount")}>My Account</MenuItem>
                <MenuItem onClick={() => handleButtonClick("/Login")}>Login</MenuItem>
                <MenuItem onClick={() => handleButtonClick("/Logout")}>Logout</MenuItem>
                <MenuItem onClick={() => handleButtonClick("/Register")}>Register</MenuItem>
              </Menu>
            </div>

        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default withRouter(Header);