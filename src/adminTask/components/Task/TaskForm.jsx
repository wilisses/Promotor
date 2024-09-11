import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import { db } from "../../../service/firebase";
import { ref, onValue } from "firebase/database";

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
    const milliseconds =
      Math.floor(hour * (1000 * 60 * 60)) + Math.floor(minutes * (1000 * 60));

    addTask(title, value, milliseconds, checkboxes, promoter, client);
    setTitle("");
    setTime("");
    setValue("");
    // setPromoter(0);
    // setClient(0);
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
      <h2>Criar Tarefa:</h2>

      <form onSubmit={handleSubmit}>
        <label>Promotor</label>
        <select
          onChange={promoterChange}
          placeholder="Promotor"
          value={promoter}
        >
          <option value="0"></option>
          {companyData
            .filter((promoter) => promoter.position === 1)
            .map((promoter) => (
              <option key={promoter.key} value={promoter.key}>
                {promoter.name}
              </option>
            ))}
        </select>
        <label>Cliente</label>
        <select onChange={clientChange} placeholder="Cliente" value={client}>
          <option value="0"></option>
          {dataClientEmployee.map((client) => (
            <option key={client.key} value={client.key}>
              {client.name}
            </option>
          ))}
        </select>
        <label>Titulo</label>
        <input
          type="text"
          placeholder="Digite o título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Duração</label>
        <input
          type="text"
          placeholder="00:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <label>Descrição</label>
        <ReactQuill
          value={value}
          onChange={setValue}
          modules={modules} // Passa a configuração personalizada para os módulos
          formats={formats} // Define os formatos permitidos
        />
        <label>Checklists</label>
        <button
          onClick={(e) => {
            e.preventDefault();
            addCheckbox();
          }}
        >
          Adicionar Checkbox
        </button>
        <br />
        <br />
        {checkboxes.map((checkbox) => (
          <div key={checkbox.id}>
            <input
              type="text"
              name={checkbox.name}
              checked={checkbox.checked || false}
              onChange={(e) => handleChange(checkbox.id, e.target.value)}
            />
            <button onClick={() => removeCheckbox(checkbox.id)}>X</button>
          </div>
        ))}
        <br />
        <br />
        <button type="submit">Criar Tarefas</button>
      </form>
    </div>
  );
};

export default TaskForm;
