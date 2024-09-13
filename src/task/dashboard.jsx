import React, { useState, useEffect } from "react";
import Task from "./components/Task/Task";
import "../App.css";
import Modal from "./components/Modal/Modal";
import Header from "./components/Header/header";
import { formatDateTime } from "../App";
import { db } from "../service/firebase";
import { ref, update, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

export const status = {
  0: { name: "Iniciar", cor: "#5cb85c" },
  1: { name: "Iniciado", cor: "#00BFFF" },
  2: { name: "Finalizar", cor: "#CD5C5C" },
  3: { name: "Finalizado", cor: "#b8a920" },
  4: { name: "Encerrado", cor: "#DC143C" },
  5: { name: "Retomar", cor: "#b8a920" },
};

const ITEMS_PER_PAGE = 4;

const Dashboard = () => {
  const [task, setTasks] = useState([]);
  const [filter, setFilter] = useState("Incomplete");
  const [sort, setSort] = useState("Asc");
  const [search, setSearch] = useState("");
  const [taskCorrent, setTaskCorrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataClientEmployee, setDataClientEmployee] = useState([]);
  const [keyCurrent, setKeyCurrent] = useState(
    JSON.parse(sessionStorage.getItem("key"))
  );
  const [clientCurrent, setClientCurrent] = useState("0");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const client = sessionStorage.getItem("client") || "0";
    setClientCurrent(client);

    if (client !== "0") {
      handleTask({ key: client });
    } else {
      openModal();
    }
    const authsRef = ref(db, `clientEmployee/${keyCurrent.key}`);
    onValue(authsRef, (snapshot) => {
      const data = snapshot.val();
      const clientEmployee = data
        ? Object.keys(data).map((key) => ({ key: key, ...data[key] }))
        : [];
      setDataClientEmployee(clientEmployee);
    });
  }, []);

  const setTask = (id, newTask) => {
    setTasks(newTask);
    if (id === null) {
      return;
    }
    const updateRef = ref(db, `tasks/${keyCurrent.key}/${clientCurrent}`);

    newTask.map((updateTask) => {
      if (updateTask.id === id) {
        update(updateRef, { [id]: updateTask })
          .then(() => {
            console.log("Update successful");
          })
          .catch((error) => {
            console.error("Update failed", error);
          });
      }
    });
  };

  const handleTask = (client) => {
    if (client && client !== "0") {
      sessionStorage.setItem("client", client.key)
      setClientCurrent(client.key);
      const authsRef = ref(db, `tasks/${keyCurrent.key}/${client.key}`);
      onValue(authsRef, (snapshot) => {
        const data = snapshot.val();
        const taskArray = Object.values(data || {});
        setTask(null, taskArray);
      });
    }
    closeModal();
  };

  const modal = (id, status) => {
    if (status === 0) {
      const currentDate = formatDateTime(new Date());

      const newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 1,
              timeStart: currentDate,
              timeProcessEnd: dayjs(currentDate)
                .add(task.time, "millisecond")
                .format("YYYY-MM-DD HH:mm:ss"),
            }
          : task
      );

      setTask(id, newTask);
    } else if (status === 5) {
      const currentDate = formatDateTime(new Date());

      const newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 1,
              timePause: (() => {
                const keys = Object.keys(task.timePause || {}).length - 1;
                const timePause = task.timePause || {};

                const updatedTimePause = { ...timePause };

                if (updatedTimePause[keys]) {
                  updatedTimePause[keys] = {
                    ...updatedTimePause[keys],
                    timeEnd: currentDate,
                  };
                } else {
                  updatedTimePause[keys] = {
                    timeStart: task.timeStart || currentDate,
                    timeEnd: currentDate,
                  };
                }

                return updatedTimePause;
              })(),
              timeProcessEnd: dayjs(currentDate)
                .add(task.time, "millisecond")
                .format("YYYY-MM-DD HH:mm:ss"),
            }
          : task
      );

      setTask(id, newTask);
    } else {
      const selectedTask = task.find((task) => task.id === id);
      setTaskCorrent(selectedTask);
      openModal();
    }
  };

  const completeTask = (id, comment, taskCorrent, encerrarPause) => {
    const currentDate = formatDateTime(new Date());
    let newTask;
    if ((taskCorrent.status === 1 && comment !== "", encerrarPause === "1")) {
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              comment: comment,
              status: 4,
              timeEnd: currentDate,
              timeProcessEnd: null,
            }
          : task
      );
      setTask(id, newTask);
    }

    if ((taskCorrent.status === 1 && comment !== "", encerrarPause === "0")) {
      newTask = task.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 5,
              timePause: {
                ...task.timePause,
                [Object.keys(task.timePause || {}).length || 0]: {
                  timeStart: currentDate,
                  comment: comment,
                },
              },
              time: dayjs(taskCorrent.timeProcessEnd)
                .set("second", 0)
                .diff(dayjs().set("second", 0), "millisecond"),
              timeProcessEnd: null,
            }
          : task
      );
      setTask(id, newTask);
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
              timeProcessEnd: null,
            }
          : task
      );

      setTask(id, newTask);
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
        const checkedCount = newCheckboxes.filter(
          (checkbox) => checkbox.ischecked
        ).length;
        const contProgress = Math.floor((checkedCount * 100) / lengthTask);

        return { ...task, checkboxes: newCheckboxes, progress: contProgress };
      }
      return task;
    });

    setTask(id, newTask);
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
    setTask(id, newTask);
  };

  const addComment = (id, comment) => {
    const currentDate = formatDateTime(new Date());
    let newTask;
    newTask = task.map((task) =>
      task.id === id
        ? {
            ...task,
            comments: [
              { id: uuidv4(), comment: comment, date: currentDate },
              ...(task.comments ||
                [].filter((comment) => comment !== undefined)),
            ],
          }
        : task
    );
    setTask(id, newTask);
  };

  const progressChange = () => {
    const newTask = task.map((task) => {
      const lengthTask = task.checkboxes ? task.checkboxes.length : 0;

      if (lengthTask === 0) {
        return { ...task, progress: 0 };
      }

      const checkedCount = task.checkboxes.filter(
        (checkbox) => checkbox.ischecked
      ).length;

      const contProgress = Math.floor((checkedCount * 100) / lengthTask);

      return { ...task, progress: contProgress };
    });

    setTask(null, newTask);
  };

  const [page, setPage] = useState(1);

  const filteredTasks = task
    .filter((task) =>
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.isCompleted
        : !task.isCompleted
    )
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "Asc"
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text)
    );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <Header
        dataClientEmployee={dataClientEmployee}
        handleTask={handleTask}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        clientCurrent={clientCurrent}
        keyCurrent={keyCurrent}
      />
      <div className="app">
        <div className="body">
          <h1>Lista de Tarefas</h1>
          <div className="Stack">
            <Stack spacing={2}>
              <div className="Stack_content">
                <div>
                  {paginatedTasks.map((task) => (
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
                <div>
                  <Pagination
                    count={Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)} // Total de páginas
                    page={page}
                    onChange={handleChangePage}
                  />
                </div>
              </div>
            </Stack>
          </div>
          <Modal
            taskCorrent={taskCorrent}
            isOpen={isModalOpen}
            onClose={closeModal}
            completeTask={completeTask}
            dataClientEmployee={dataClientEmployee}
            handleTask={handleTask}
            clientCurrent={clientCurrent}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
