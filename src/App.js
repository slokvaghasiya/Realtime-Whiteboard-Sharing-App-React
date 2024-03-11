import "./App.css";
import { Route, Routes } from "react-router-dom";

import Forms from "./components/Forms/form";
import RoomPage from "./pages/RoomPage/RoomPage";

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms />}></Route>
        <Route path="/:roomID" element={<RoomPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
