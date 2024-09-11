import React, { useState } from "react";
import "./style.css";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Logout from "@mui/icons-material/Logout";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import FilterListIcon from "@mui/icons-material/FilterList";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/Clear";

import { useNavigate } from "react-router-dom";
import { auth } from "../../../service/firebase";
import { signOut } from "firebase/auth";

const Header = ({
  dataClientEmployee,
  handleTask,
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}) => {
  const key = JSON.parse(sessionStorage.getItem("key"));
  const clientCurrent = sessionStorage.getItem("client");

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  const handleOrder = (event) => {
    setSort(event.target.value);
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      role="presentation"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Button onClick={toggleDrawer("right", false)}>
        <IconButton>
          <ClearIcon />
        </IconButton>
      </Button>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            {key.name}
            <ListItemText />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            {key.email}
            <ListItemText />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <IconButton>
              <Logout fontSize="small" />
            </IconButton>
            Sair
            <ListItemText />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <div className="filter_menu_client">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Cliente"
            onChange={(e) => handleTask(e.target.value)}
            value={clientCurrent}
          >
            <MenuItem value="0"></MenuItem>
            {dataClientEmployee.map((clients) => (
              <MenuItem key={clients.key} value={clients.key}>
                {clients.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Box>
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("client");
      sessionStorage.removeItem("key");
      navigate("/"); // Navegar após o logout
      console.log("Usuário desconectado");
    } catch (error) {
      console.error("Erro ao desconectar", error);
    }
  };

  return (
    <div className="header">
      <div className="filter_accordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<FilterListIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <TextField
              id="outlined-basic"
              value={search}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearch(e.target.value)}
              label="Buscar"
              variant="outlined"
            />
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordion_content">
              <div className="content_options">
                <div className="options_status">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <MenuItem value="All">Todos</MenuItem>
                      <MenuItem value="Completed">Completas</MenuItem>
                      <MenuItem value="Incomplete">Incompletas</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="options_order">
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Ordenar
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={sort}
                      onChange={handleOrder}
                    >
                      <FormControlLabel
                        value="Asc"
                        control={<Radio />}
                        label="Asc"
                      />
                      <FormControlLabel
                        value="Desc"
                        control={<Radio />}
                        label="Desc"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="filter_menu">
        <React.Fragment>
          <Button onClick={toggleDrawer("right", true)}>
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar {...stringAvatar(key.name)} />
            </IconButton>
          </Button>
          <Drawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
          >
            {list("right")}
          </Drawer>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Header;
