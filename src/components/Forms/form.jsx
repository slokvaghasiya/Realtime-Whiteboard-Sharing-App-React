import React from "react";
import CreateRoom from "./CreateRoom/CreateRoom";
import JoinRoom from "./JoinRoom/JoinRoom";
import "./form.css";
const form = () => {
  return (
    <div className="row h-100 pt-5">
      <div className="form-box col-md-4 py-3 p-5 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1>Create Room</h1>
        <CreateRoom />
      </div>

      <div className="form-box col-md-4 py-3 p-5 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1>Join Room</h1>
        <JoinRoom />
      </div>
    </div>
  );
};

export default form;
