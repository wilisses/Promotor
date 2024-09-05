import { useState } from "react";
import Task from "./Components/Task/Task";
import "../App.css";
import Search from "./components/Filter/Search";
import Filter from "./components/Filter/Filter";
import Modal from "./Components/Modal/Modal";
import { Link } from 'react-router-dom';
import {formatDateTime} from '../App'

export const status = {
  0: { name: "Iniciar", cor: "#5cb85c" },
  1: { name: "Iniciado", cor: "#00BFFF" },
  2: { name: "Finalizar", cor: "#CD5C5C" },
  3: { name: "Finalizado", cor: "#b8a920" },
  4: { name: "Encerrado", cor: "#DC143C" },
};

const Dashboard = ({task, setTask}) => {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");
  const [search, setSearch] = useState("");
  const [taskCorrent, setTaskCorrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modal = (id, status) => {
    if (status === 0) {
      const currentDate = formatDateTime(new Date());
      const newTask = task.map((task) =>
        task.id === id ? { ...task, status: 1, timeStart: currentDate } : task
      );

      setTask(newTask);
    } else {
      const selectedTask = task.find((task) => task.id === id);
      setTaskCorrent(selectedTask);
      openModal();
    }
  };

  const completeTask = (id, comment, taskCorrent) => {

    console.log(id, comment, taskCorrent)
    const currentDate = formatDateTime(new Date());
    let newTask;
    if (taskCorrent.status === 1 && comment !== "") {
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              comment: comment,
              status: 4,
              timeEnd: currentDate,
            }
          : task
      );
      setTask(newTask);
    }
    
    if (taskCorrent.status === 2) {
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              comment: comment,
              status: 3,
              timeEnd: currentDate,
            }
          : task
      );
      
      setTask(newTask);
    }
    closeModal();
  };

  const handleChange = (id, id_checkbox) => {
    const newTask = task.map((task) => {
      if (task.id === id) {

        const newCheckboxes = task.checkboxes.map((checkbox) =>
          checkbox.id === id_checkbox
            ? { ...checkbox, ischecked: !checkbox.ischecked }
            : checkbox
        );
  
        const lengthTask = newCheckboxes.length;
        const checkedCount = newCheckboxes.filter((checkbox) => checkbox.ischecked).length;
        const contProgress = Math.floor((checkedCount * 100) / lengthTask);
  
        return { ...task, checkboxes: newCheckboxes, progress: contProgress };
      }
      return task;
    });
  
    setTask(newTask);
  };

  const commentChange = (id, id_comment, comment) => {
    const newTask = task.map((task) => {
      if (task.id === id) {

        const newComments = task.comments.map((comments) =>
          comments.id === id_comment
            ? { ...comments, comment: comment }
            : comments
        );
  
        return { ...task, comments: newComments };
      }
      return task;
    });
    setTask(newTask);
  };

  const addComment = (id, comment) => {
    const currentDate = formatDateTime(new Date());
    let newTask;
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              comments: [
                { id: (task.comments.length++), comment: comment, date: currentDate  },
                ...task.comments.filter(comment => comment !== undefined),
              ]
            }
          : task
      );
      setTask(newTask);
    
  };

  const progressChange = () => {
    const newTask = task.map((task) => {
      
        const lengthTask = task.checkboxes.length;
  
        if (lengthTask === 0) {
          return { ...task, progress: 0 };
        }
  
        const checkedCount = task.checkboxes.filter((checkbox) => checkbox.ischecked).length;
  
        const contProgress = Math.floor((checkedCount * 100) / lengthTask);
  
        return { ...task, progress: contProgress };
      
    });
  
    setTask(newTask);
  };
  
  return (
    <div className="app">
      <h1>Lista de Tarefas</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
      <div className="task-list">
        {task
          .filter((task) =>
            filter === "All"
              ? true
              : filter === "Completed"
              ? task.isCompleted
              : !task.isCompleted
          )
          .filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) =>
            sort === "Asc"
              ? a.text.localeCompare(b.text)
              : b.text.localeCompare(a.text)
          )
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              modal={modal}
              handleChange={handleChange}
              progressChange={progressChange}
              commentChange={commentChange}
              addComment={addComment}
            />
          ))}
      </div>
      <Modal
        taskCorrent={taskCorrent}
        isOpen={isModalOpen}
        onClose={closeModal}
        completeTask={completeTask}
      />
    </div>
  );
}

export default Dashboard;
