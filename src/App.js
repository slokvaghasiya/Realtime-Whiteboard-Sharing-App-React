import "./App.css";
import io from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast,Bounce } from 'react-toastify';
import Forms from "./components/Forms/form";
import RoomPage from "./pages/RoomPage/RoomPage";

const server = "http://localhost:8080";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttemps: "Infinity",
  timeout: 10000,
  transports: ["websocket"]
}
const socket = io(server, connectionOptions)

const App = () => {

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  const uuid = () => {
    let s4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4())
  }

  useEffect(() => {
    socket.on("UserIsJoined", (data) => {
      if (data.success) {
        console.log("User Joined");
        setUsers(data.users)
      } else {
        console.log("something Went Wrong !!");
      }
    })

    socket.on("allUsers", (data) => {
      setUsers(data)
    })

    socket.on("userJoinMsg", (data) => {
      toast.info(`${data} joined Room`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        })
    })

    socket.on("userLeftMsg", (data) => {
      toast.error(`${data} Left Room`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        })
    })

  }, [])
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}></Route>
        <Route path="/:roomID" element={<RoomPage user={user} socket={socket} users={users} />} ></Route>
      </Routes>
    </div>
  );
};

export default App;
