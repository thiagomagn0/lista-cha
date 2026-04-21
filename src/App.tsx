import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Lista from "./pages/Lista/Lista";
import Evento from "./pages/Evento/Evento";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lista" element={<Lista />} />
        <Route path="/evento" element={<Evento />} />
      </Routes>
    </BrowserRouter>
  );
}