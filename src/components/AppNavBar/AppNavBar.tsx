import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AccountCircle } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { styled, alpha } from "@mui/material/styles";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getHasActiveSessionAsync } from "../../reducers/app-slice";
import {
  doSearchAsync,
  selectSearchResults,
} from "../../reducers/search-slice";
import { SearchResultsPopUp } from "../SearchResultsPopup";
import { TSearchResults } from "../../services/search/search.types";

interface IAppNavBarProps {
  hasSession: boolean;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
function AppNavBar(props: IAppNavBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const searchResults = useSelector(selectSearchResults, shallowEqual);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    sessionStorage.setItem("token", "");
    dispatch(getHasActiveSessionAsync());
  };

  const [, setSearchTestString] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const LoggedInMenuItems = () => {
    return (
      <div>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ManageAccountsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AnalyticsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Analytics</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={handleLogout}>Log out</ListItemText>
        </MenuItem>
      </div>
    );
  };

  const handleSearchTextOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchActive(true);
    setSearchValue(event.target.value);
  };

  const handleSearchMenuClickAway = () => {
    setSearchActive(false);
  };

  const setSearchValue = (value: string) => {
    setSearchTestString(value);
    dispatch(doSearchAsync({ data: value }));
  };

  const handleClickIntoSearchTextBox = (event: any) => {
    if (event.target.value.length > 0 && !searchActive) {
      setSearchActive(true);
      setSearchValue(event.target.value);
    }
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          {props.hasSession && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchTextOnChange}
                onClick={handleClickIntoSearchTextBox}
              />
            </Search>
          )}
          {props.hasSession && (
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
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <LoggedInMenuItems />
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {searchActive && (
        <SearchResultsPopUp
          onClickAway={handleSearchMenuClickAway}
          searchData={searchResults as TSearchResults}
        />
      )}
    </Box>
  );
}

export default AppNavBar;
