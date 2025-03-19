import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const socket = io("http://localhost:5069");

const SealingMachine = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    sealingPressure: "--",
    speed: "--",
    lastUpdated: "--",
  });

  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]); // Stores active alerts

  useEffect(() => {
    socket.on("sealingData", (data) => {
      console.log("Received sealing machine data:", data); // Debug log
      setSensorData(data);

      setChartData((prevData) => {
        const updatedData = [...prevData, { ...data, time: data.lastUpdated }];
        return updatedData.length > 10 ? updatedData.slice(1) : updatedData;
      });

      checkAlerts(data);
    });

    return () => {
      socket.off("sealingData");
    };
  }, []);

  // Function to check for critical values and trigger alerts
  const checkAlerts = (data) => {
    let newAlerts = [];

    if (data.temperature > 200) newAlerts.push("🔥 High Temperature Alert: Over 200°C");
    if (data.sealingPressure > 100) newAlerts.push("⚠️ High Pressure Alert: Over 100 PSI");
    if (data.speed > 4000) newAlerts.push("⚠️ High Speed Alert: Over 4000 RPM");

    setAlerts(newAlerts);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Sealing Machine</h1>
      <p className="mt-2 text-gray-400">Live sensor data updates every 2 seconds.</p>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mt-4 bg-red-600 text-white p-3 rounded-lg">
          <h3 className="text-lg font-semibold">🚨 ALERTS 🚨</h3>
          <ul className="mt-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-sm">{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sensor Cards */}
      <div className="grid grid-cols-3 gap-5 mt-5">
        <div className={`p-4 rounded-lg text-center ${sensorData.temperature > 200 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Temperature</h3>
          <p className="text-3xl mt-2">{sensorData.temperature}°C</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${sensorData.sealingPressure > 100 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Sealing Pressure</h3>
          <p className="text-3xl mt-2">{sensorData.sealingPressure} PSI</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${sensorData.speed > 4000 ? "bg-red-500" : "bg-gray-800"}`}>
          <h3 className="text-lg font-semibold">Speed</h3>
          <p className="text-3xl mt-2">{sensorData.speed} RPM</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="mt-8 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Sensor Data Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} />
            <Line type="monotone" dataKey="sealingPressure" stroke="#1e90ff" strokeWidth={2} />
            <Line type="monotone" dataKey="speed" stroke="#32cd32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-gray-500 text-sm">Last updated: {sensorData.lastUpdated}</p>
    </div>
  );
};

export default SealingMachine;