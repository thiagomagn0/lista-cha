import { useNavigate } from "react-router-dom";
import "./Home.css";
import Countdown from "../../components/Countdown";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home__overlay">
        <h1 className="home__title">
          <span>Maressa &</span>
          <span>Thiago</span>
        </h1>

       <div className="home__cards">

          <div className="home__card" onClick={() => navigate("/lista")}>
            <p className="home__card-title">Lista de Presentes</p>
            <p className="home__card-subtitle">Escolha com carinho</p>
          </div>

          <div className="home__card" onClick={() => navigate("/evento")}>
            <p className="home__card-title">Local do Evento</p>
            <p className="home__card-subtitle">Veja como chegar</p>
          </div>

        </div>

        <Countdown />
      <div className="home__whatsapp">
  <a
          href="https://wa.me/5599999999999"
          target="_blank"
          className="home__whatsapp"
        >
          Falar no WhatsApp
        </a>
      </div>
      
      </div>
    </div>
  );
}