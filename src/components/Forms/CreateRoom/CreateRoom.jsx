import React, { useState } from "react";

const CreateRoom = ({ uuid,socket,setUser }) => {

  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("")

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name, 
      roomId, 
      userId: uuid(), 
      host: true, 
      presence: true
    }
    setUser(roomData)
    socket.emit("userJoined",roomData)
  }

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input type="text" className="form-control my-2" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Enter Your Name" />
      </div>

      <div className="form-group border">

        <div className="input-group d-flex align-items-center justify-content-center">

          <input type="text" className="form-control my-2 border-0" value={roomId} disabled placeholder="Generate Room Code" />
          <div className="input-group-append ">
            <button type="button" className="btn btn-primary btn-sm me-1" onClick={() => { setRoomId(uuid()) }} > Generate </button>
            <button type="button" className="btn btn-outline-danger btn-sm me-2"> Copy </button>
          </div>

        </div>
      </div>
      <button type="submit" onClick={handleCreateRoom} className="mt-4 btn btn-primary btn-block form-control" > Generate Room </button>
    </form>
  );
};

export default CreateRoom;
