import './App.css';
import { useState, useEffect } from 'react';
import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';

function App() {

  // const [state, setState] = useState({
  //   'todoList': [],
  //   'activeItem': {
  //     'id': null,
  //     'title': '',
  //     'completed': false,
  //   },
  //   editing: false
  // });

  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null, 
    title: '',
    completed: false
  });
  const [edit, setEdit] = useState(false);

  function fetchTasks() {
    return fetch('http://127.0.0.1:8000/api/task_list/')
        .then(response => response.json())
        .then(data => setTodoList(data))
  }

  function handleChange(e) {
    var name = e.target.name
    var value = e.target.value
    console.log(name, value)
    setActiveItem({
      ...activeItem,
      title: value
    })
  }  

  function handleSubmit(e){
    e.preventDefault();
    console.log("ITEM", activeItem)

    var url = 'http://127.0.0.1:8000/api/task_create/'

    if (edit){
      url = `http://127.0.0.1:8000/api/task_update/${activeItem.id}/`
      setEdit(false)
    }


    fetch(url, {
      method:'POST',
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify(activeItem)
    }).then((response)=>{
      fetchTasks()
      setActiveItem({
        id: null, 
        title: '',
        completed: false
      })
    }).catch(function(err){
      console.log('Err', err)
    })
  }

  function startEdit(task) {
    setActiveItem(task)
    setEdit(true)
  }

  function deleteItem(task){
    fetch(`http://127.0.0.1:8000/api/task_delete/${task.id}/`,{
      method:'DELETE',
      headers:{
        'Content-type':'application/json'
      }
    }).then((response) => fetchTasks())
  }

  function strikeUnstrike(task)  {
    task.completed = !task.completed
    console.log("Task", task.completed)

    fetch(`http://127.0.0.1:8000/api/task_update/${task.id}/`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body: JSON.stringify({'completed': task.completed, 'title': task.title})
    }).then((response) => fetchTasks())
  }

  useEffect(()=> {
      console.log("Fetching Data...");
      fetchTasks()
  }, []);


  var tasks = todoList;
  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form id="form" onSubmit={handleSubmit}>
              <div className="flex-wrapper">
                <div style={{flex: 7}}>
                  <input onChange={handleChange} type="text" name="title" id="title" value={activeItem.title} className="form-control" placeholder="Add Task" />
                </div>
                <div style={{flex: 1}}>
                  <input type="submit" id="submit" className="btn" />
                </div>
              </div>
          </form>
        </div>
        <div id="list-wrapper">
          {tasks.map(function(task, index){
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                
                <div onClick={()=> strikeUnstrike(task)} style={{flex:7}}>
                  {task.completed == false ? (
                    <span>{task.title}</span> 
                  ):(
                    <strike><i>{task.title}</i></strike>
                  )
                }
                  
                </div>
                <div style={{flex:1}}>
                <button onClick={() => startEdit(task)} className="btn btn-sm btn-outline-dark edit">Edit</button>
                </div>
                <div style={{flex:1}}>
                <button onClick={() => deleteItem(task)} className="btn btn-sm btn-outline-danger delete">Delete</button>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
