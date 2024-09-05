import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './task/dashboard';
import DashboardAdmin from './adminTask/admin';
import Auth from './auth/auth'

export const formatDateTime = (date) => {
  if (isNaN(date) || date === null) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


function App() {

  const [task, setTask] = useState([
    {
      id: 1,
      title: "nada",
      text: "<h1>teste</h1><ol><li>teste1</li><li>teste2</li><li>teste3</li><li>teste4</li></ol><p><strong>obs: </strong><em><u>realizar tudo</u></em></p>",
      isCompleted: false,
      status: 0,
      time: 60000,
      timeStart: null,
      timeEnd: null,
      comment: "",
      checkboxes: [{id: 0, name: 'teste ', ischecked: false},{id: 1, name: 'teste1', ischecked: false}],
      progress: 0,
      comments:[]
    },
    {
      id: 2,
      title: "tudo",
      text: "tudo",
      isCompleted: false,
      status: 0,
      time: 1800000,
      timeStart: null,
      timeEnd: null,
      comment: "",
      checkboxes: [],
      progress: 0,
      comments:[]
    },
    {
      id: 3,
      title: "varios",
      text: "varios",
      isCompleted: false,
      status: 0,
      time: 88200000,
      timeStart: null,
      timeEnd: null,
      comment: "",
      checkboxes: [{id: 0, name: 'teste ', ischecked: false},{id: 1, name: 'teste1', ischecked: true},{id: 2, name: 'teste2', ischecked: true},{id: 3, name: 'teste3', ischecked: false}],
      progress: 0,
      comments:[]
    },
  ]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Dashboard" element={<Dashboard key={task.id} task={task} setTask={setTask} />} />
        <Route path="/Admin" element={<DashboardAdmin key={task.id} task={task} setTask={setTask} />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="*" element={<NotFound />} /> Rota para páginas não encontradas */}
      </Routes>
    </Router>
  );
}

export default App;
