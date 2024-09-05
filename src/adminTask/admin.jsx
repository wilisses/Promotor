
import TaskForm from "./components/Task/TaskForm";
import "../App.css";
import { useNavigate } from 'react-router-dom';
import {auth} from '../service/firebase'
import { signOut } from 'firebase/auth';
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

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Navegar após o logout
      console.log('Usuário desconectado');
    } catch (error) {
      console.error('Erro ao desconectar', error);
    }
  };

  return (
    <div className="app">
      <button onClick={handleLogout}>voltar</button>
      <h1>Criar Tarefas</h1>
      <TaskForm addTask={addTask} />
    </div>
  );
}

export default Admin;
