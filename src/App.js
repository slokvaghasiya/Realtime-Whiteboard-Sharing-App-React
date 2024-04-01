import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState,useEffect } from "react";
import Forms from "./components/Forms/form";
import RoomPage from "./pages/RoomPage/RoomPage";
import io  from "socket.io-client";



const server = "http://localhost:8080";
const connectionOptions = {
  "force new connection" : true,
  reconnectionAttemps:"Infinity",
  timeout:10000,
  transports:["websocket"]
} 
const socket = io(server,connectionOptions)

const App = () => {
  
  const [user,setUser] = useState(null)

  const uuid = ()=>{
    let s4 = ()=>{
      return (((1  + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return ( s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4() )
  }

  useEffect(()=>{
    socket.on("UserIsJoined",(data)=>{
      if (data.success) {
        console.log("User Joined");
      } else {
        console.log("something Went Wrong !!");
      }
    })
  },[])

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}></Route>
        <Route path="/:roomID" element={<RoomPage user={user} socket={socket} />} ></Route>
      </Routes>
    </div>
  );
};

export default App;
