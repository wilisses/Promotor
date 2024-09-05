import React, { useEffect, useState } from "react";
import "./style.css";
import { status } from "../../dashboard";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CircularProgressWithLabel from './Progress'

const modules = {
  toolbar: [
    ['image'],
    ['bold', ],
    ['italic'],
    ['underline'],
    ['strike'],
    [{ 'color': [] }], 
    [{ 'background': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'list': 'ordered'}], 
    [{ 'list': 'bullet' }],
    [{ 'align': [] }],
    ['blockquote'], 
    [ 'code-block'],
    ['clean']
  ],
};

const formats = [
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'align',
  'blockquote',
  'code-block',
  'image',
  'color',
  'background',
  'clean'
];

const Task = ({ task, modal, handleChange, progressChange, commentChange, addComment}) => {
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");

  const parseDate = (dateStr) => {
    const [date, time] = dateStr.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const [difference, setDifference] = useState(() => {
    const totalMinutes = Math.floor(task.time / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return {
      minutes: remainingMinutes.toString().padStart(2, "0"),
      hours: totalHours.toString().padStart(2, "0"),
    };
  });


  useEffect(() => {
    let intervalId;
    progressChange();
    if (task.status === 1) {
      intervalId = setInterval(() => {
        const currentDate = new Date();
        
        const timeStart = new Date(task.timeStart);
        const timeDate = new Date(timeStart.getTime() + task.time);
        
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
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [task.status]);

  const update = () => {
    if (task.status === 1) {
      task.status = 2;
    }
  };
  const handleSubmit = (e, id) =>{
    e.preventDefault();
    if( !comment) return;
    addComment(id,comment);
    setComment("");
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    if (isNaN(date)) {
      console.error('Invalid date string');
      return '';
    }
  
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
  
    const dateOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
  
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
  
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', timeOptions);
  
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
  };

  return (
    <div
      className="task"
    >
      <div>
      <Accordion>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="title">
            <p style={{ textDecoration: task.isCompleted ? "line-through" : "" }} >{task.title}</p>
              <button
                className="complete"
                style={{
                  background:
                    task.status === 1
                      ? status[task.status].cor
                      : task.status === 4
                      ? status[task.status].cor
                      : task.status === 2
                      ? status[task.status].cor
                      : task.status === 3
                      ? status[task.status].cor
                      : task.status === 0
                      ? status[task.status].cor
                      : "",
                }}
                onClick={(event) => {modal(task.id, task.status); event.stopPropagation();}}
              >
                {task.status === 1
                  ? `${status[task.status].name} ${difference.hours}h ${difference.minutes}min`
                  : status[task.status].name}
                {difference.hours <= "00" && difference.minutes <= "00"
                  ? update()
                  : ""}
              </button>
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
            {task.checkboxes.length > 0 && (      
              <div className="group">
                <div className="title"><h3>Checklist</h3> <div className="titleprogress"><CircularProgressWithLabel value={task.progress} /></div></div>
                
                <FormGroup className="formgroup">
                  {task.checkboxes.map((checkbox) => (
                    <FormControlLabel className="FormControlLabel" key={checkbox.id} required control={<Checkbox defaultChecked={checkbox.ischecked} onChange={() => handleChange(task.id ,checkbox.id)} />} label={checkbox.name} />
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
                    modules={modules} // Passa a configuração personalizada para os módulos
                    formats={formats} // Define os formatos permitidos
                  />
                  <button type="submit" >Salvar</button>
                </div>
              </form>
            </div>

            <div className="group">
              {task.comments.map((comment) => (
                <div key={comment.id}>
                  <form onSubmit={(e) => handleComment(e, task, comment.id)}>
                    <p>{formatDate(comment.date)}</p>
                    <div
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: comment.comment }}
                      onInput={(e) => setEditComment(e.target.innerHTML)}
                      className="textInnerHTML"
                    />
                    <button type="submit">
                      Salvar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      </div>
    </div>
  );
};

export default Task;
