import React, { useState, useEffect } from "react";
import "./App.css";
import axios from 'axios';



function App(){
  const [data, setData] = useState([]);
  const [todoText, setTodoText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/addToDo', { text: todoText })
     .then(response => {
        console.log(response.data);
        setTodoText('');
        refreshTable();
      })
     .catch(error => {
        console.error(error);
        alert(error.message)
}   );
  }
  
  const refreshTable = () => {
    fetch("/getToDos")
    .then((res) => res.json())
    .then((data) => {
        setData(data);
      })
    .catch((error) => {
      alert("Error fetching data from DataBase")
      });
  }

  useEffect(() => {
    fetch("/getToDos")
     .then((res) => res.json())
     .then((data) => {
        setData(data);
      })
     .catch((error) => {
        alert("Error fetching data from DataBase")
      });
  }, []);


  const deleteTask = (id) => {
    fetch(`/deleteToDo/${id}`, { method: "DELETE" }).then((res) => res.json()).then((data) => {
      refreshTable()
    });
  };

  return (
    <div className="App">
      
      <header className="App-header">
        <h1>To-Do List</h1>
        <table id="todoTable">
          <thead>
            <tr>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <button className="trashButton" onClick={() => deleteTask(item.id)}>
                    <i className="fa fa-trash-o" style={{ fontSize: '48px', color: '#C41E3A' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={todoText} onChange={e => setTodoText(e.target.value)} />
        <button type="submit">Add To Do</button>
      </form>
    </div>
      </header>
    </div>
  );
}

export default App;