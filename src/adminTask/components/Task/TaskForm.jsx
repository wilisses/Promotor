import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import { db } from "../../../service/firebase";
import { ref, onValue } from "firebase/database";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";

import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const modules = {
  toolbar: [
    [
      "image",
      "bold",
      "italic",
      "underline",
      "strike",
      { color: [] },
      { background: [] },
      { list: "ordered" },
      { list: "bullet" },
      { align: [] },
      "blockquote",
      "code-block",
      "clean",
    ],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "blockquote",
  "code-block",
  "image",
  "color",
  "background",
  "clean",
];

const TaskForm = ({ addTask, companyData }) => {
  const [value, setValue] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [checkboxes, setCheckboxes] = useState([]);
  const [checkboxCount, setCheckboxCount] = useState(1);
  const [dataClientEmployee, setDataClientEmployee] = useState([]);
  const [promoter, setPromoter] = useState("");
  const [client, setClient] = useState("");

  const addCheckbox = () => {
    setCheckboxes([
      { id: checkboxCount, name: "", ischecked: false },
      ...checkboxes,
    ]);
    setCheckboxCount(checkboxCount + 1);
  };

  const handleChange = (id, name) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, name } : checkbox
      )
    );
  };

  const removeCheckbox = (id) => {
    setCheckboxes(checkboxes.filter((checkbox) => checkbox.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title ||
      !time ||
      !value ||
      value === "<p><br></p>" ||
      !promoter ||
      promoter === "0" ||
      !client ||
      client === "0"
    ) {
      console.error("All fields are required and must be valid.");
      return;
    }

    const [hour, minutes] = time.split(":").map(Number);

    const timeInMilliseconds =
      dayjs()
        .startOf("day")
        .add(hour, "hour")
        .add(minutes, "minute")
        .valueOf() - dayjs().startOf("day").valueOf();

    addTask(title, value, timeInMilliseconds, checkboxes, promoter, client);
    setTitle("");
    setTime("");
    setValue("");
    setCheckboxCount(1);
    setCheckboxes([]);
  };

  const promoterChange = (event) => {
    setPromoter(event.target.value);
    const authsRef = ref(db, `clientEmployee/${event.target.value}`);
    onValue(authsRef, (snapshot) => {
      const data = snapshot.val();
      const clientEmployee = data
        ? Object.keys(data).map((key) => ({ key: key, ...data[key] }))
        : [];
      setDataClientEmployee(clientEmployee);
    });
  };

  const clientChange = (event) => {
    setClient(event.target.value);
  };

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <div className="FormControl">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Promotor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Promotor"
              onChange={promoterChange}
              value={promoter}
            >
              <MenuItem value="0"><p></p></MenuItem>
              {companyData
                .filter((promoter) => promoter.position === 1)
                .map((promoter) => (
                  <MenuItem key={promoter.key} value={promoter.key}>
                    {promoter.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
            <Select
            disabled={promoter === "0"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Cliente"
              onChange={clientChange}
              value={client}
            >
              <MenuItem value="0"><p></p></MenuItem>
              {dataClientEmployee.map((clients) => (
                <MenuItem key={clients.key} value={clients.key}>
                  {clients.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="TextFields">
          <TextField
            id="outlined-basic"
            className="title"
            label="Titulo"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
          />
          <InputMask
            mask="99:99"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            maskChar={null}
          >
            {(inputProps) => (
              <TextField {...inputProps} label="Duração" variant="outlined" />
            )}
          </InputMask>
        </div>
        <h3>Descrição</h3>
        <ReactQuill
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
        />
        <div className="Checklists">
          <div className="title">
            <h3>Checklists</h3>
            <Button
              onClick={(e) => {
                e.preventDefault();
                addCheckbox();
              }}
              variant="contained"
            >
              Novo
            </Button>
          </div>
          <div className="checkboxes_TextFields">
            {checkboxes.map((checkbox) => (
              <div key={checkbox.id} className="TextFields">
                <TextField
                  id="outlined-basic"
                  type="text"
                  className="textField"
                  label={`Checklist`}
                  name={checkbox.name}
                  value={checkbox.name}
                  checked={checkbox.ischecked || false}
                  onChange={(e) => handleChange(checkbox.id, e.target.value)}
                  variant="outlined"
                />

                <Button onClick={() => removeCheckbox(checkbox.id)}>
                  <IconButton>
                    <ClearIcon />
                  </IconButton>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <br />
        <br />
        <Button type="submit" variant="contained">
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
