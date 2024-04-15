import React, { useRef, useState, useEffect } from "react";
import "./RoomPage.css";
import WhiteBorad from "../../components/Whiteboard/WhiteBorad";
import {ToastContainer } from 'react-toastify';

const RoomPage = ({ user, socket, users }) => {

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([])
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("")

  useEffect(() => {
    socket.on("messageRes", (data) => {
      setChat((prevChats) => [...prevChats, data])
    });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setChat((prevChats) => [...prevChats, { message, name: "You" }])
      socket.emit("message", { message })
      setMessage("")
    }
  }

  const canvasClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height,);
    setElements([])
  }

  const handleUndo = () => {
    setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
    setElements((prevElements) => prevElements.slice(0, prevElements.length - 1))
  }

  const handleRedo = () => {
    setElements((prevElements) => [...prevElements, history[history.length - 1]])
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  }

  return (
    <div style={{ backgroundColor: "#dbebfa", height: "100vh" }} >
      <ToastContainer/>

      <div className="row"  >
        <div className="container d-flex justify-content-evenly align-items-center" >

          {/*  Button For Open User Tab */}
          <div className="headerButton" >
            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions1" aria-controls="offcanvasWithBothOptions" className="userBtn">Users<i className="fa-solid fa-users fa-xl"></i></button>
          </div>

          {/*  User Area Code  */}
          <div className="offcanvas offcanvas-start text-bg-dark" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions1" aria-labelledby="offcanvasWithBothOptionsLabe" >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Close</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              {
                users.map((usr, index) =>
                  (<p key={index * 999} className="my-2 text-center w-100" >{index + 1}.  {usr.name} {user && user.userId === usr.userId && "(You)"} </p>)
                )
              }
            </div>
          </div>

          <div className="headerText" >
            <h1 className="text-center py-4">
              White Borad Sharing App{" "}
              <span className="text-primary">[User Online - {users.length}]</span>
            </h1>
          </div>

          {/* User Chat-Button */}
          <div className="headerButton" >
            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" className="chatBtn"  >Chats<i className="fa-solid fa-comments fa-xl"></i></button>
          </div>

          {/* User Chat-Box */}
          <div className="offcanvas offcanvas-end text-bg-dark" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel" >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Close</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <div className="w-100 mt-5 p-2 border border-1 border-white rounded-3" style={{ height: "80%" }} >
                {
                  chat.map((msg, index) => (
                    <p key={index * 99} className='my-2 text-center w-100' >
                      {msg.name}: {msg.message}
                    </p>
                  ))
                }
              </div>
              <form onSubmit={handleSubmit} className="w-100 mt-4 d-flex rounded-3  ">
                <input type="text" className='h-100 border-0 rounded-0 py-2 px-4' style={{ width: "100%", }} placeholder='Enter a message' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" className='btn bg-primary rounded-0' >send</button>
              </form>
            </div>
          </div>
        </div>

        {
          user?.presenter && (
            <div className="col-md-10 mx-auto px-5 mt-2  mb-3 d-flex align-items-center justify-content-center">

              <div className="d-flex col-md-2 justify-content-center gap-1">
                <div className="d-flex gap-1 align-items-center">
                  <i htmlFor="pencil" className="fa-solid fa-pencil fa-xl"></i>
                  <input type="radio" id="pencil" name="tool" value="pencil" checked={tool === "pencil"} className="radioButton form-check-input" onChange={(e) => setTool(e.target.value)} />
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <i htmlFor="line" className="fa-solid fa-lines-leaning fa-xl"></i>
                  <input type="radio" id="line" name="tool" value="line" className="radioButton form-check-input" onChange={(e) => setTool(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <i htmlFor="react" className="fa-regular fa-square fa-xl"></i>
                  <input type="radio" id="rect" name="tool" value="rect" className="radioButton form-check-input" onChange={(e) => setTool(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <i class="fa-regular fa-circle fa-xl"></i>
                  <input type="radio" id="rect" name="tool" value="circle" className="radioButton form-check-input" onChange={(e) => setTool(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3 mx-auto">
                <div className="d-flex align-items-center justify-content-center">
                  <label htmlFor="color">Select Color:</label>
                  <input type="color" id="color" className="mt-1 ms-3" value={color} onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary mt-1" disabled={elements.length === 0} onClick={() => { handleUndo() }} >Undo</button>
                <button className="btn btn-outline-primary mt-1" disabled={history.length < 1} onClick={() => { handleRedo() }} >Redo</button>
              </div>
              <div className="col-md-2">
                <button className="btn btn-danger" onClick={canvasClear}  >Clear Canvas</button>
              </div>
            </div>
          )
        }
        <div className="canvas-box col-md-10 mx-auto mt-4 ">
          <WhiteBorad canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} color={color} tool={tool} user={user} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
