import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

const modules = {
  toolbar: [
    ['image','bold', 'italic' ,'underline', 'strike',{ 'color': [] },{ 'background': [] },{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] },'blockquote','code-block','clean'],
 
  ],
};

const formats = [
  'bold','italic','underline','strike','list','bullet','align','blockquote','code-block','image','color','background','clean'
];


const TaskForm = ( {addTask}) => {
    const [value, setValue] = useState("");
    const [time, setTime] = useState("");
    const [title, setTitle] = useState("");
    const [checkboxes, setCheckboxes] = useState([]);
    const [checkboxCount, setCheckboxCount] = useState(1);

    const addCheckbox = () => {
      setCheckboxes([
        { id: checkboxCount, name: '', ischecked: false  },
        ...checkboxes
      ]);
      setCheckboxCount(checkboxCount + 1);
    };

    const handleChange = (id, name) => {
      setCheckboxes(
        checkboxes.map((checkbox) =>
          checkbox.id === id ? { ...checkbox, name } : checkbox
        )
      );
    };

    const removeCheckbox = (id) => {
      setCheckboxes(checkboxes.filter((checkbox) => 
        checkbox.id !== id
        )
      );
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        if( !value && !time) return;

        const [hour, minutes] = time.split(':').map(Number);
        const milliseconds = Math.floor(hour *(1000 * 60 * 60)) + Math.floor(minutes *(1000 * 60));
        
        addTask(title, value, milliseconds, checkboxes);
        setTitle("");
        setTime("");
        setValue("");
        setCheckboxCount(1);
        setCheckboxes([]);
    }
  return (
    <div className='task-form'>
        <h2>Criar Tarefa:</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Digite o título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="00:00" value={time} onChange={(e) => setTime(e.target.value)} />
            <ReactQuill
              value={value}
              onChange={setValue}
              modules={modules} // Passa a configuração personalizada para os módulos
              formats={formats} // Define os formatos permitidos
            />
            <button onClick={(e) => {
              e.preventDefault();
              addCheckbox();
            }}>Adicionar Checkbox</button>

            {checkboxes.map((checkbox) => (
            <div key={checkbox.id}>
                <input
                  type="text"
                  name={checkbox.name}
                  checked={checkbox.checked || false}
                  onChange={(e) => handleChange(checkbox.id, e.target.value)}
                />
                <button onClick={() => removeCheckbox(checkbox.id)}>X</button>
            </div>
            
          ))}
          
          <button type="submit">Criar Tarefas</button>
        </form>
        
    </div>
  )
}

export default TaskForm