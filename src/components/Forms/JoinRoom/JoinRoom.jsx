import React from "react";

const JoinRoom = () => {
  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter Your Name"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control my-2 border"
          placeholder="Enter Room Code"
        />
      </div>
      <button
        type="submit"
        className="mt-4 btn btn-primary btn-block form-control"
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoom;
