import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./Confirmacao.css";
import { useNavigate } from "react-router-dom";
import { ThankYouModal } from "../../components/AgradecimentoModal/AgradecimentoModal";

export default function Confirmacao() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("sim");
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);
   const playSound = () => {
  const audio = new Audio("/sounds/aplausos.wav");
    audio.volume = 0.3;
    audio.play();
  };
  const playSadSound2 = () => {
  const audio = new Audio("/sounds/aww.wav");
  audio.volume = 0.2;
  audio.play().catch(() => {});
};
  const handleSubmit = async () => {
    if (!name) {
        alert("Informe seu nome");
        return;
    }

    await addDoc(collection(db, "confirmacoes"), {
        name,
        status,
        createdAt: new Date(),
    });

    
    if (status === "sim") {
      playSound();
    } else {
      playSadSound2();
    }
    setName("");
   
    

setTimeout(() => {
  navigate("/");
}, 2000);
    };

  return (
    <div className="confirmacao">
      <div className="confirmacao__container">
         <h1 className="confirmacao__title">Confirmação de Presença</h1>
        <div className="content__card">
            <div className="confirmacao__card">
                <input
                className="confirmacao__input"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <select
                className="confirmacao__select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                >
                <option value="sim">Vou comparecer 💛</option>
                <option value="nao">Não poderei ir 😢</option>
                </select>

                <button className="confirmacao__button" onClick={handleSubmit}>
                Confirmar
                </button>
            </div>
        </div>
            <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        />
      </div>
     
    </div>
    
  );
}