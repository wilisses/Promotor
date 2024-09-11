import React, { useState } from "react";
import "./style.css";
import { status } from "../../dashboard";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

const Modal = ({
  taskCorrent,
  isOpen,
  onClose,
  completeTask,
  dataClientEmployee,
  handleTask,
}) => {
  const [comment, setComment] = useState("");
  const [encerrar, setEncerrar] = useState(false);
  const minLength = 20;
  const clientCurrent = sessionStorage.getItem("client");
  const formatDateTime = (dateString) => {
    console.log(dateString);
    if (dateString === null) {
      return "";
    }
    const date = new Date(dateString);

    if (!(date instanceof Date)) {
      return "";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.length < minLength) return;
    completeTask(taskCorrent.id, comment, taskCorrent);
    setComment("");
    setEncerrar(false);
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={() => {setEncerrar(false); onClose();}}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_close">
          <Button onClick={() => {setEncerrar(false); onClose();}}>
            <IconButton>
              <ClearIcon />
            </IconButton>
          </Button>
        </div>
        {!clientCurrent ? (
          <div>
            <h2>Informe um cliente</h2>
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
        ) : taskCorrent && taskCorrent.status === 1 ? (
          <div>
            <h2>Encerrar Tarefa</h2>
            <p>
              {!encerrar
                ? "Tem certeza que deseja encerrar?"
                : `Informe uma justificativa com pelo menos ${minLength} caracteres!`}
            </p>
            <div>
              {!encerrar ? (
                <div className="encerrar_button">
                  <Button variant="contained" onClick={() => setEncerrar(true)}>
                    Sim
                  </Button>
                  <Button variant="contained" onClick={onClose}>
                    Não
                  </Button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleSubmit}>
                    
                    <TextField
                      className="comment"
                      id="standard-basic"
                      label="Comentário"
                      variant="standard"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      defaultValue="Campo Obrigatorio!!!"
                    />
                    <p className="minLength">{comment.length}</p>
                    <Button variant="contained" type="submit">
                      Confirmar
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : taskCorrent ? (
          <div>
            <p>Titulo: {taskCorrent?.title}</p>
            <p>Início: {formatDateTime(taskCorrent?.timeStart)}</p>
            <p>Termíno: {formatDateTime(taskCorrent?.timeEnd)}</p>
            <Button
              variant="contained"
              onClick={() => completeTask(taskCorrent.id, comment, taskCorrent)}
            >
              {taskCorrent.status === 3 || taskCorrent.status === 4
                ? "Fechar"
                : status[taskCorrent.status].name}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
