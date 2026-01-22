import "./App.css";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  EditableText,
  InputGroup,
  OverlayToaster,
} from "@blueprintjs/core";

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const toasterRef = useRef();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          toasterRef.current?.show({
            message: "User added successfully",
            intent: "success",
            timeout: 3000,
          });
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });
    }
  }

  function onChangeHandler(id, key, value){

    setUsers((users) => {
      return users.map(user => {
       return user.id === id ? {...user, [key]: value } : user;
      })
    })

  }

  function updateUser(id){
    const user = users.find((user) => user.id === id)
    fetch(`https://jsonplaceholder.typicode.com/users/10`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          toasterRef.current?.show({
            message: "User updated successfully",
            intent: "success",
            timeout: 3000,
          });
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });
    

  }

  function deleteUser(id){

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
        })
        .then((response) => response.json())
        .then((data) => {

          setUsers((users) => {

           return users.filter((user => user.id !== id))
          })
          toasterRef.current?.show({
            message: "User deleted successfully",
            intent: "success",
            timeout: 3000,
          });
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });

  }

  return (
    <div className="App">
      <OverlayToaster ref={toasterRef} position="top" />
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText value={user.email} onChange={value => onChangeHandler(user.id, 'email', value)}/>
              </td>
              <td>
                <EditableText value={user.website} onChange={value => onChangeHandler(user.id, 'website', value)}/>
              </td>
              <td>
                <Button intent="primary" onClick={() => updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter Name..."
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter Email..."
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="Enter Website..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}


export default App;
