import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const JoinRoom = ({uuid,socket,setUser}) => {

  const [roomId,setRoomId] = useState("")
  const [name,setName] = useState("")
  const navigate = useNavigate()
  const handleRoomJoin = (e)=>{
    e.preventDefault();
    const roomData = {
      name, 
      roomId, 
      userId: uuid(), 
      host: true, 
      presence: true
    }
    setUser(roomData)
    navigate(`${roomId}`)
    socket.emit("userJoined",roomData)
  }

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e)=>{ setName(e.target.value)}}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control my-2 border"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e)=>{ setRoomId(e.target.value)}}
        />
      </div>
      <button type="submit" className="mt-4 btn btn-primary btn-block form-control" onClick={handleRoomJoin}>
        Join Room
      </button>
    </form>
  );
};

export default JoinRoom;
