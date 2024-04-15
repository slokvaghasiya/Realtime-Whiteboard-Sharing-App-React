import React from "react";
import CreateRoom from "./CreateRoom/CreateRoom";
import JoinRoom from "./JoinRoom/JoinRoom";
import "./form.css";
const form = ({ uuid, socket, setUser }) => {

  return (

      <div className="formContainer pt-5">
        <div className="form-box col-md-4 py-3 p-5 mt-5 rounded-2 mx-auto d-flex flex-column align-items-center">
          <h1 className="formHeader" >Create Room</h1>
          <CreateRoom uuid={uuid} socket={socket} setUser={setUser} />
        </div>

        <div className="form-box col-md-4 py-3 p-5 mt-5 rounded-2 mx-auto d-flex flex-column align-items-center">
          <h1 className="formHeader" >Join Room</h1>
          <JoinRoom uuid={uuid} socket={socket} setUser={setUser} />
        </div>
      </div>
   
  );
};

export default form;
