import React, { useEffect, useState } from "react";
import "./Task.css";
import { status } from "../../App";
const Task = ({ task, setTask, removeTask, modal }) => {
  const parseDate = (dateStr) => {
    const [date, time] = dateStr.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const [difference, setDifference] = useState({
    minutes: Math.floor(task.time / (1000 * 60))
      .toString()
      .padStart(2, "0"),
    hours: Math.floor(task.time / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0"),
  });

  useEffect(() => {
    let intervalId;

    if (task.status === 1) {
      intervalId = setInterval(() => {
        const currentDate = new Date();
        const timeDate = new Date(task.timeStart.getTime() + task.time);

        const options = { timeZone: "America/Sao_Paulo", hour12: false };
        const newCurrentDate = currentDate
          .toLocaleString("pt-BR", options)
          .replaceAll(",", "");
        const newTimeDate = timeDate
          .toLocaleString("pt-BR", options)
          .replaceAll(",", "");

        const date1 = parseDate(newTimeDate);
        const date2 = parseDate(newCurrentDate);
        const differenceInMs = date1 - date2;

        const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60))
          .toString()
          .padStart(2, "0");
        const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0");

        setDifference({
          minutes: differenceInMinutes,
          hours: differenceInHours,
        });
      }, 60000); // Update every minute60000

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [task.status]);

  const update = () => {
    if (task.status === 1) {
      task.status = 2;
    }
  };

  return (
    <div
      className="task"
      style={{ textDecoration: task.isCompleted ? "line-through" : "" }}
    >
      <div className="content">
        <p>{task.text}</p>
        <p className="category">({task.category})</p>
      </div>
      <div>
        <button
          className="complete"
          style={{
            background:
              task.status === 1
                ? "#00BFFF"
                : task.status === 4
                ? "#DC143C"
                : task.status === 2
                ? "#CD5C5C"
                : task.status === 3
                ? "#b8a920"
                : "",
          }}
          onClick={() => modal(task.id, task.status)}
        >
          {task.status === 1
            ? `${status[task.status].name} ${difference.hours}h ${difference.minutes}min`
            : status[task.status].name}
          {difference.hours <= "00" && difference.minutes <= "00"
            ? update()
            : ""}
        </button>
        <button className="remove" onClick={() => removeTask(task.id)}>
          x
        </button>
      </div>
    </div>
  );
};

export default Task;
