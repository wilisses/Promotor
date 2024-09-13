import React, { useState, useEffect } from "react";
import "./style.css";
import { status } from "../../dashboard";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";

const Modal = ({
  taskCorrent,
  isOpen,
  onClose,
  completeTask,
  dataClientEmployee,
  handleTask,
  clientCurrent
}) => {
  const [comment, setComment] = useState("");
  const [buttons, setButtons] = useState(false);
  const [encerrarPause, setEncerrarPause] = useState("");
  const minLength = 20;

  const calculateTotalTime = () => {
    let totalPause = 0;

    Object.values(taskCorrent?.timePause || {}).forEach((keys) => {
      const entry = keys as { timeStart: string; timeEnd: string };

      if (entry.timeStart && entry.timeEnd) {
        const start = dayjs(entry.timeStart);
        const end = dayjs(entry.timeEnd);

        totalPause += end.diff(start, "millisecond");
      }
    });

    const start = dayjs(taskCorrent?.timeStart);
    const end = dayjs(taskCorrent?.timeEnd);
    const totalProgress = end.diff(start, "millisecond");

    const total = totalProgress - totalPause;

    const totalSeconds = Math.floor(total / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const renderPauseEntries = () => {
    return Object.values(taskCorrent?.timePause || {}).map((keys, index) => {
      const entry = keys as {
        timeStart: string;
        timeEnd: string;
        comment?: string;
      };

      if (entry.timeStart && entry.timeEnd) {
        return (
          <div key={index}>
            <p>Pausa {index + 1}</p>
            <p>
              Início:{" "}
              {formatDateTime(
                dayjs(entry.timeStart).format("YYYY-MM-DD HH:mm:ss")
              )}
            </p>
            <p>
              Término:{" "}
              {formatDateTime(
                dayjs(entry.timeEnd).format("YYYY-MM-DD HH:mm:ss")
              )}
            </p>
            {entry.comment && <p>Comentário: {entry.comment}</p>}
          </div>
        );
      }
      return null;
    });
  };

  const formatDateTime = (dateString) => {
    if (dateString === undefined) {
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
    completeTask(taskCorrent.id, comment, taskCorrent, encerrarPause);
    setEncerrarPause("");
    setComment("");
    setButtons(false);
  };

  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      onClick={() => {
        setEncerrarPause("");
        setButtons(false);
        onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_close">
          <Button
            onClick={() => {
              setEncerrarPause("");
              setButtons(false);
              onClose();
            }}
          >
            <IconButton>
              <ClearIcon />
            </IconButton>
          </Button>
        </div>
        {clientCurrent === "0" ? (
          <div>
            <h2>Informe um cliente</h2>
            <Autocomplete
              disablePortal
              options={dataClientEmployee.map((client) => ({
                label: client.name,
                key: client.key,
              }))}
              renderInput={(params) => (
                <TextField {...params} label="Cliente" />
              )}
              onChange={(event, newValue) => {
                handleTask(newValue);
              }}
            />
          </div>
        ) : taskCorrent && taskCorrent.status === 1 ? (
          <div>
            {!buttons ? (
              <div className="encerrar_pause_button">
                <Button
                  className="button"
                  variant="contained"
                  onClick={() => {
                    setEncerrarPause("0");
                    setButtons(true);
                  }}
                >
                  Pausar
                </Button>
                <Button
                  className="button"
                  variant="contained"
                  onClick={() => {
                    setEncerrarPause("1");
                    setButtons(true);
                  }}
                >
                  Encerrar
                </Button>
              </div>
            ) : (
              <div>
                <h2>
                  {encerrarPause === "1" ? "Encerrar Tarefa" : "Pausar Tarefa"}
                </h2>
                <p>
                  {`Informe uma justificativa com pelo menos ${minLength} caracteres!`}
                </p>
                <div>
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
                </div>
              </div>
            )}
          </div>
        ) : taskCorrent ? (
          <div>
            <p>Titulo: {taskCorrent?.title}</p>
            <p>Status: {status[taskCorrent?.status].name}</p>
            {taskCorrent?.status === 4 ? (
              <p>Comentário: {taskCorrent?.comment}</p>
            ) : null}

            <p>Duração: {calculateTotalTime()}</p>
            <p>Início: {formatDateTime(taskCorrent?.timeStart)}</p>
            <p>Termíno: {formatDateTime(taskCorrent?.timeEnd)}</p>
            {renderPauseEntries()}

            {taskCorrent.status !== 3 && taskCorrent.status !== 4 ? (
              <Button
                variant="contained"
                onClick={() =>
                  completeTask(taskCorrent.id, comment, taskCorrent)
                }
              >
                {status[taskCorrent.status].name}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
