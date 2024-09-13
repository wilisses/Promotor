import React, { useEffect, useState } from "react";
import TaskForm from "./components/Task/TaskForm";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import { db } from "../service/firebase";
import { ref, update, onValue } from "firebase/database";
import Header from "./components/Header/header";

const Admin = () => {
  const [companyData, setCompanyData] = useState([]);
  const key = JSON.parse(sessionStorage.getItem("key"));
  useEffect(() => {
    const authsRef = ref(db, "authentication");
    onValue(authsRef, (snapshot) => {
      const data = snapshot.val();
      const auths = data
        ? Object.keys(data).map((key) => ({ key: key, ...data[key] }))
        : [];
      const companyData = auths.filter(
        (companys) => companys.company === key.company
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
    };

    const updateRef = ref(db, `tasks/${promoter}/${client}`);

    update(updateRef, { [newTask.id]: newTask })
      .then(() => {
        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed", error);
      });
  };

  return (
    <div className="app">
      <Header
      />
      <div className="body">
        <h1>Criar Tarefas</h1>
        <div className="Stack">
        <TaskForm addTask={addTask} companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
