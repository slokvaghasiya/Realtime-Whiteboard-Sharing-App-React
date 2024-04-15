import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRoom.css"
import "aos/dist/aos.css";
import { Tooltip } from 'react-tooltip'
import { Bounce, ToastContainer, toast } from 'react-toastify';

const CreateRoom = ({ uuid, socket, setUser }) => {

  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true
    }
    navigate(`/${roomId}`)
    setUser(roomData)
    socket.emit("userJoined", roomData)
  }

  return (
    <form onSubmit={handleCreateRoom} className="form col-md-12 mt-5">
      <div className="form-group">
        <input type="text" className="form-control my-2" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Enter Your Name" required />
      </div>

      <div className="form-group">

        <div className="input-group d-flex align-items-center justify-content-center">

          <input type="text" className="form-control my-2 rounded-1" value={roomId} disabled />
          <div className="input-group-append ">
            <ul className="icons  " >

              <li className="icon" id="generate" data-tooltip-content='Generate' data-tooltip-place='top' data-tooltip-id='generate'>
                <i className="fa-solid fa-arrows-rotate fa-xl" style={{ color: "#0a0a0b" }} onClick={() => { setRoomId(uuid()) }} ></i>
                <Tooltip id='generate' style={{ backgroundColor: "#0a0a0b", fontSize: "15px" }} />
              </li>

              <li className="icon" id="copy" data-tooltip-content='Copy' data-tooltip-place='top' data-tooltip-id='copy' >
                <i
                  id="liveToastBtn"
                  className="copyIcon fa-solid fa-copy fa-xl"
                  style={{ color: "#0a0a0b" }}
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    toast.success("RoomId Copied !",{
                      position: "bottom-right",
                      autoClose: 1500,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      transition: Bounce,
                      })
                  }}>
                </i>
                <Tooltip id='copy' style={{ backgroundColor: "#0a0a0b", fontSize: "15px" }} />
              </li>
            </ul>

          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 btn btn-primary btn-block form-control" > Generate Room </button>
      <ToastContainer position="bottom-right"
        
        />
    </form>
  );
};

export default CreateRoom;
