import React, { useEffect, useState } from "react";
import "./style.css";
import { status } from "../../dashboard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CircularProgressWithLabel from "./Progress";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import CreateIcon from "@mui/icons-material/Create";
import IconButton from "@mui/material/IconButton";

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

const Task = ({
  task,
  modal,
  handleChange,
  progressChange,
  commentChange,
  addComment,
}) => {
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [remainingTime, setRemainingTime] = useState(() => {
    const diffInMilliseconds = dayjs(task.timeProcessEnd)
      .set("second", 0)
      .diff(dayjs().set("second", 0), "millisecond");
    return task.timeProcessEnd === undefined
      ? task.time
      : diffInMilliseconds <= 0
      ? 0
      : diffInMilliseconds;
  });

  const formatTime = (timeInMs) => {
    if (timeInMs <= 0) {
      return { minutes: "00", hours: "00" };
    }

    const totalMinutes = Math.floor(timeInMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return {
      minutes: remainingMinutes.toString().padStart(2, "0"),
      hours: totalHours.toString().padStart(2, "0"),
    };
  };

  useEffect(() => {
    let intervalId;

    progressChange(task.id);

    if (task.status === 1) {
      const oldDate = dayjs(task.timeProcessEnd);
      const currentDate = dayjs();
      if (currentDate.isAfter(oldDate)) {
        setRemainingTime(0);
      }

      intervalId = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return prevRemainingTime - 60000;
        });
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [task.status]);

  const update = () => {
    if (task.status === 1) {
      task.status = 2;
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    if (!comment) return;
    addComment(id, comment);
    setComment("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date)) {
      console.error("Invalid date string");
      return "";
    }

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const dateOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const dateFormatter = new Intl.DateTimeFormat("pt-BR", dateOptions);
    const timeFormatter = new Intl.DateTimeFormat("pt-BR", timeOptions);

    if (isToday) {
      return timeFormatter.format(date);
    } else {
      return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
    }
  };

  const handleComment = (e, task, id) => {
    e.preventDefault();

    commentChange(task.id, id, editComment);
    setEditComment("");
    handleEdit(null);
  };

  const handleEdit = (id) => {
    setEditCommentId(id);
  };

  return (
    <div className="task">
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div className="title">
              <p
                style={{
                  textDecoration: task.isCompleted ? "line-through" : "",
                }}
              >
                {task.title}
              </p>
              {remainingTime <= 0 ? update() : ""}
              <Button
                variant="outlined"
                style={{
                  color: status[task.status] ? status[task.status].cor : "",
                  borderColor: status[task.status]
                    ? status[task.status].cor
                    : "",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  fontSize: "0.60rem",
                }}
                onClick={(event) => {
                  modal(task.id, task.status);
                  event.stopPropagation();
                }}
              >
                {task.status === 1
                  ? `${status[task.status].name} 
                  ${formatTime(remainingTime).hours}h 
                  ${formatTime(remainingTime).minutes}min`
                  : status[task.status].name}
              </Button>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="content">
              <div className="group">
                <h3>Descrição</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: task.text }}
                  className="textInnerHTML"
                />
              </div>
              {task.checkboxes && task.checkboxes.length > 0 && (
                <div className="group">
                  <div className="title">
                    <h3>Checklist</h3>{" "}
                    <div className="titleprogress">
                      <CircularProgressWithLabel value={task.progress} />
                    </div>
                  </div>

                  <FormGroup className="formgroup">
                    {task.checkboxes.map((checkbox) => (
                      <FormControlLabel
                        className="FormControlLabel"
                        key={checkbox.id}
                        required
                        control={
                          <Checkbox
                            defaultChecked={checkbox.ischecked}
                            onChange={() => handleChange(task.id, checkbox.id)}
                          />
                        }
                        label={checkbox.name}
                      />
                    ))}
                  </FormGroup>
                </div>
              )}
              <div className="group">
                <form onSubmit={(e) => handleSubmit(e, task.id)}>
                  <h3>Atividade</h3>
                  <div className="comment">
                    <ReactQuill
                      className="reactQuill"
                      value={comment}
                      onChange={setComment}
                      modules={modules}
                      formats={formats}
                    />
                    <Button type="submit" variant="contained">
                      Salvar
                    </Button>
                  </div>
                </form>
              </div>
              <div className="comments">
                {task.comments && (
                  <div className="group">
                    <div className="forms">
                      {task.comments.map((comment) => (
                        <div key={comment.id}>
                          <form
                            className="form"
                            onSubmit={(e) => handleComment(e, task, comment.id)}
                          >
                            <div className="form_time">
                              {formatDate(comment.date)}
                            </div>
                            <div className="form_textInnerHTML">
                              <div
                                contentEditable={editCommentId === comment.id}
                                dangerouslySetInnerHTML={{
                                  __html: comment.comment,
                                }}
                                onInput={(e) => {
                                  setEditComment(e.target.innerHTML);
                                }}
                                className="textInnerHTML"
                              />
                              <div className="form_buttons">
                                {editCommentId === comment.id ? (
                                  <div>
                                    <Button
                                      type="submit"
                                      className="form_button"
                                    >
                                      Salvar
                                    </Button>

                                    <Button
                                      type="submit"
                                      className="form_button"
                                      onClick={() => handleEdit(null)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    className="form_button"
                                    onClick={() => handleEdit(comment.id)}
                                  >
                                    Editar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Task;
