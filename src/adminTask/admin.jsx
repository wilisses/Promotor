import React, { useEffect, useState } from "react";
import TaskForm from "./components/Task/TaskForm";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../service/firebase";
import { ref, update, onValue } from "firebase/database";

const Admin = ({ task, setTask }) => {
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    const key = sessionStorage.getItem("key");
    const authsRef = ref(db, "authentication");
    onValue(authsRef, (snapshot) => {
      const data = snapshot.val();
      const auths = data
        ? Object.keys(data).map((key) => ({ key: key, ...data[key] }))
        : [];
      const companyData = auths.filter(
        (companys) => companys.company === JSON.parse(key).company
      );
      setCompanyData(companyData);
    });
  }, [setCompanyData]);
  const addTask = (title, text, time, checkboxes, promoter, client) => {
    const newTask = {
      id: uuidv4(),
      title,
      text,
      isCompleted: false,
      status: 0,
      time,
      timeStart: null,
      timeEnd: null,
      comment: "",
      checkboxes,
      progress: 0,
      comments: [],
      situation: 0,
    };

    const updateRef = ref(db, `tasks/${promoter}/${client}`);

    // Adiciona a nova tarefa ao Firebase
    update(updateRef, { [newTask.id]: newTask })
      .then(() => {
        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed", error);
      });
  };

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
    <div className="app">
      <button onClick={handleLogout}>voltar</button>
      <h1>Criar Tarefas</h1>
      <TaskForm addTask={addTask} companyData={companyData} />
    </div>
  );
};

export default Admin;
