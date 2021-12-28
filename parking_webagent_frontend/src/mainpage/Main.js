import * as React from "react";
import { useHistory } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { secondaryListItems } from "./menulist";
import MainListItems from "./menulist";

import Chart from "../util/chart/Chart";
import axios from "axios";
import { axiosApiInstance } from "../routes";
import AlertDialog from "../util/Dialog/AlertDialog";
import MainRoutes from "../MainRoutes";
import jwt_decode from "jwt-decode";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © Nuricon"} {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export default function MainContent(props) {  
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const [title, setTitle] = React.useState("대쉬보드");
  const [userId, setUserId] = React.useState("");  
  const [logoutFail, setLogoutFail] = React.useState(false);
  
  const token = sessionStorage.getItem("access_token");
  if (token == null)
    history.push("/login");
  

  const decoded = jwt_decode(token);
  const userInfo = {
    roleContext: decoded.role,
    useridContext: decoded.userid,
    uuidContext: decoded.uuid,
  };
  //console.log(userInfo);

  React.useEffect(() => {
    setUserId(props.location.userId);    
  }, [props.user])

  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [openLogoutAlarm, setOpenLogoutAlarm] = React.useState(false);

  const handleLogout = () => {
    setOpenLogoutAlarm(true);
  };

  const requestLogout = () => {
    axiosApiInstance.post(      
      '/api/user/logout',
    ).then((res) => {
      history.push("/login");      
    }, (error) => {
      console.log("failed to logout");      
      setLogoutFail(true);
    })    
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >              
              <MenuIcon />              
            </IconButton>
            <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
              {title}
            </Typography>            
            
            <AccountBoxIcon style={{margin: '5px'}} />
            {userId}
            <IconButton onClick={handleLogout} color = "inherit" title="logout">
              <LogoutIcon style={{marginLeft: '25px'}} />
            </IconButton>
            <Snackbar autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={logoutFail} onClose={() => setLogoutFail(false)} >
              <Alert onClose={() => setLogoutFail(false)} severity='error'>
                Logout 실패 - 요청이 실패했습니다. 잠시 후 다시 시도하세요.
              </Alert>
            </Snackbar>
          </Toolbar>
        </AppBar>
        {openLogoutAlarm ? <AlertDialog level='info' title='logout' message='정말로 로그아웃 하시겠습니까?' open={setOpenLogoutAlarm} doYes={requestLogout} /> : null}

        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
            <MainListItems setTitle={setTitle} userinfo={userInfo} />
          <Divider />          
        </Drawer>

        {/* 중앙 frame */}
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <MainRoutes userinfo={userInfo} />
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      
    </ThemeProvider>
  );
}
