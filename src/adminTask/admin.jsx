
import TaskForm from "./components/Task/TaskForm";
import "../App.css";
import { Link } from 'react-router-dom';
const Admin = ({task, setTask}) => {
  
  const addTask = (title, text, time, checkboxes) => {
    const newTask = [
      ...task,
      {
        id: Math.floor(Math.random() * 10000),
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
        comments:[]
      },
    ];
    setTask(newTask);
  };


  return (
    <div className="app">
      <h1>Criar Tarefas</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
      <TaskForm addTask={addTask} />
    </div>
  );
}

export default Admin;
