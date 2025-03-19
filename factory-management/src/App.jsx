import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Conveyor from "./pages/Conveyor";
import Filling from "./pages/Filling";
import Sealing from "./pages/Sealing";
import RobotArm from "./pages/RobotArm";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-900 text-white min-h-screen p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conveyor" element={<Conveyor />} />
          <Route path="/filling" element={<Filling />} />
          <Route path="/sealing" element={<Sealing />} />
          <Route path="/robot-arm" element={<RobotArm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
