import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./Admin.css";

type Reserva = {
  item: string;
  name: string;
  phone: string;
};

type Confirmacao = {
  name: string;
  status: string;
};

export default function Admin() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);

  useEffect(() => {
    const load = async () => {
      // 🎁 presentes
      const reservasSnap = await getDocs(collection(db, "reservas"));
      const reservasData = reservasSnap.docs.map(
        (doc) => doc.data() as Reserva
      );

      // 📅 confirmações
      const confirmSnap = await getDocs(collection(db, "confirmacoes"));
      const confirmData = confirmSnap.docs.map(
        (doc) => doc.data() as Confirmacao
      );

      setReservas(reservasData);
      setConfirmacoes(confirmData);
    };

    load();
  }, []);

  // 📊 métricas
  const totalPresentes = reservas.length;
  const totalConfirmacoes = confirmacoes.length;

  const confirmados = confirmacoes.filter(c => c.status === "sim").length;
  const naoConfirmados = confirmacoes.filter(c => c.status === "nao").length;

  return (
    <div className="admin">
      <div className="admin__container">
         <h1 className="admin__title">Painel do Evento</h1>

      {/* 📊 RESUMO */}
      <div className="admin__stats">
        <div className="admin__stat">
          <p className="admin__stat-number">{totalPresentes}</p>
          <p className="admin__stat-label">Presentes</p>
        </div>

        <div className="admin__stat">
          <p className="admin__stat-number">{confirmados}</p>
          <p className="admin__stat-label">Confirmados</p>
        </div>

        <div className="admin__stat">
          <p className="admin__stat-number">{naoConfirmados}</p>
          <p className="admin__stat-label">Não irão</p>
        </div>
        <div className="admin__stat">
          <p className="admin__stat-number">{totalConfirmacoes}</p>
          <p className="admin__stat-label">Confirmações</p>
        </div>
      </div>

      {/* 🎁 PRESENTES */}
      <h2 className="admin__section-title">Presentes 🎁</h2>

      <div className="admin__list">
        {reservas.map((r, index) => (
          <div key={index} className="admin__card">
            <p className="admin__item">🎁 {r.item}</p>
            <p>👤 {r.name}</p>
            <p>📱 {r.phone}</p>
          </div>
        ))}
      </div>

      {/* 📅 CONFIRMAÇÕES */}
      <h2 className="admin__section-title">Confirmações 💛</h2>

      <div className="admin__list">
        {confirmacoes.map((c, index) => (
          <div key={index} className="admin__card">
            <p>👤 {c.name}</p>
            <p>
              {c.status === "sim"
                ? "✅ Vai comparecer"
                : "❌ Não irá"}
            </p>
          </div>
        ))}
      </div>
      </div>
     
    </div>
  );
}