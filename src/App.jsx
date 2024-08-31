import { useState } from "react";
import Task from "./components/Task/Task";
import "./App.css";
import TaskForm from "./components/Task/TaskForm";
import Search from "./components/Filter/Search";
import Filter from "./components/Filter/Filter";
import Modal from "./components/Modal/Modal";

export const status = {
  0: { name: "Iniciar" },
  1: { name: "Iniciado" },
  2: { name: "Finalizar" },
  3: { name: "Finalizado" },
  4: { name: "Encerrado" },
};

function App() {
  const [task, setTask] = useState([
    {
      id: 1,
      text: "nada",
      category: "Trabalho",
      isCompleted: false,
      status: 0,
      time: 180000,
      start: null,
      end: null,
      comment: "",
    },
    {
      id: 2,
      text: "tudo",
      category: "Pessoal",
      isCompleted: false,
      status: 0,
      time: 1800000,
      start: null,
      end: null,
      comment: "",
    },
    {
      id: 3,
      text: "varios",
      category: "Estudos",
      isCompleted: false,
      status: 0,
      time: 900000,
      timeStart: null,
      timeEnd: null,
      comment: "",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");
  const [search, setSearch] = useState("");
  const [taskCorrent, setTaskCorrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (text, category) => {
    const newTask = [
      ...task,
      {
        id: Math.floor(Math.random() * 10000),
        text,
        category,
        isCompleted: false,
        status: 0,
        time: 900000,
        start: null,
        end: null,
        comment: "",
      },
    ];
    setTask(newTask);
  };

  const removeTask = (id) => {
    const newTask = task.filter((task) => task.id !== id);
    setTask(newTask);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modal = (id, status) => {
    if (status === 0) {
      const currentDate = new Date();
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
    console.log(id, comment, taskCorrent);
    const currentDate = new Date();
    let newTask;
    if (taskCorrent.status === 1 && comment !== "") {
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              comment: comment,
              status: 5,
              timeEnd: currentDate,
            }
          : task
      );
    } else if (taskCorrent.status === 2) {
      console.log("AQUI", taskCorrent.status, id);
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
    }
    console.log(newTask);
    setTask(newTask);
  };

  return (
    <div className="app">
      <h1>Lista de Tarefas</h1>
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
            task.text.toLowerCase().includes(search.toLowerCase())
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
              setTask={setTask}
              removeTask={removeTask}
              modal={modal}
            />
          ))}
      </div>
      <TaskForm addTask={addTask} />
      <Modal
        taskCorrent={taskCorrent}
        isOpen={isModalOpen}
        onClose={closeModal}
        completeTask={completeTask}
      />
    </div>
  );
}

export default App;
