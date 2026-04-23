import { useEffect, useState } from "react";
import { Gift, User, Phone, Wallet, MessageCircle } from "lucide-react";
import { SkeletonCard } from "../../components/SkeletonCard/SkeletonCard";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useToast } from "../../hooks/useToast";
import "./Admin.css";

type Reserva = {
  id: string;
  item: string;
  name: string;
  phone: string;
   status: "pendente" | "pago";
  type: "pix" | "presente";
  price?: number;
  
};

type Confirmacao = {
  id: string;
  name: string;
   phone: string; // 👈 precisa existir
  status: "sim" | "nao";
};

export default function Admin() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);

  const { showToast } = useToast();
const [loading, setLoading] = useState(true);
const load = async () => {
  setLoading(true);

  const reservasSnap = await getDocs(collection(db, "reservas"));
  const confirmSnap = await getDocs(collection(db, "confirmacoes"));

  const reservasData = reservasSnap.docs.map((doc) => ({
    id: doc.id,
    phone: "",
    ...doc.data(),
  })) as Reserva[];

  const confirmData = confirmSnap.docs.map((doc) => ({
    id: doc.id,
    phone: "",
    ...doc.data(),
  })) as Confirmacao[];

  setReservas(reservasData);
  setConfirmacoes(confirmData);

  setLoading(false);
};
const toggleConfirmacao = async (c: Confirmacao) => {
  const newStatus = c.status === "sim" ? "nao" : "sim";

  await updateDoc(doc(db, "confirmacoes", c.id), {
    status: newStatus,
  });

  showToast(
    newStatus === "sim"
      ? "Confirmado presença ✅"
      : "Marcado como não irá ❌",
    "success"
  );

  load();
};
  const togglePaymentStatus = async (r: Reserva) => {
  const newStatus = r.status === "pago" ? "pendente" : "pago";

  await updateDoc(doc(db, "reservas", r.id), {
    status: newStatus,
  });

  showToast(
    newStatus === "pago"
      ? "Marcado como pago 💰"
      : "Pagamento desmarcado 🔄",
    "success"
  );

  load();
};

useEffect(() => {
  const fetchData = async () => {
    await load();
  };

  fetchData();
}, []);

 

const handleDeleteConfirmacao = async (id: string) => {
  await deleteDoc(doc(db, "confirmacoes", id));

  showToast("Confirmação removida ❌", "info");

  load();
};
  // ❌ excluir reserva
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "reservas", id));

    showToast("Reserva removida ❌", "info");
    load();
  };

  // 📊 métricas
  const totalPresentes = reservas.length;
  const totalConfirmacoes = confirmacoes.length;

  const confirmados = confirmacoes.filter(c => c.status === "sim").length;
  const naoConfirmados = confirmacoes.filter(c => c.status === "nao").length;
  const pixReservas = reservas.filter(r => r.type === "pix");

const totalPago = pixReservas
  .filter(r => r.status === "pago")
  .reduce((acc, r) => acc + (r.price ?? 0), 0);

const totalPendente = pixReservas
  .filter(r => r.status === "pendente")
  .reduce((acc, r) => acc + (r.price ?? 0), 0);

const totalGeral = pixReservas
  .reduce((acc, r) => acc + (r.price ?? 0), 0);

  return (
    <div className="admin fade-page">
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
          <div className="admin__stat">
            <p className="admin__stat-number">R$ {totalPago.toFixed(2)}</p>
            <p className="admin__stat-label">Recebido</p>
          </div>

          <div className="admin__stat">
            <p className="admin__stat-number">R$ {totalPendente.toFixed(2)}</p>
            <p className="admin__stat-label">Pendente</p>
          </div>

          <div className="admin__stat">
            <p className="admin__stat-number">R$ {totalGeral.toFixed(2)}</p>
            <p className="admin__stat-label">Total PIX</p>
          </div>
        </div>

        {/* 🎁 PRESENTES */}
        <h2 className="admin__section-title">Presentes 🎁</h2>

        <div className="admin__list">
          {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                    </>
                  ) : (
                    reservas.map((r) => (
                      <div key={r.id} className="admin__card">
                        
              <div className="card-header">
                <span className="card-item">
                  <Gift size={14} /> {r.item}
                </span>

                <span className={`status ${r.status}`}>
                  {r.status}
                </span>
              </div>

              <div className="card-body">
                <div><User size={14}/> {r.name}</div>
                <div><Phone size={14}/> {r.phone}</div>
              </div>

              <div className="card-payment">
                <Wallet size={14}/>
                <span>
                  {r.type === "pix" ? "PIX" : "Presente"}
                </span>
              </div>

              {r.type === "pix" && (
                <div className="card-price">
                  R$ {(r.price ?? 0).toFixed(2)}
                </div>
              )}

              <div className="card-actions">
                <button onClick={() => togglePaymentStatus(r)}>
                  {r.status === "pago" ? "Desmarcar" : "Marcar pago"}
                </button>

                <button onClick={() => handleDelete(r.id)}>
                  Excluir
                </button>
              </div>
            </div>
              ))
                 
              )}
          
        </div>

        {/* 📅 CONFIRMAÇÕES */}
        <h2 className="admin__section-title">Confirmações 💛</h2>

        <div className="admin__list">
          {confirmacoes.map((c) => (
            <div key={c.id} className="admin__card">

              <div className="card-header">
                <span className="card-item">
                  👤 {c.name}
                </span>

              <span className={`status ${c.status}`}>
  {c.status === "sim" ? "✔ Vai" : "✖ Não vai"}
</span>
              </div>

              <div className="card-body">
                <div className="info-row between">

                  {/* 📱 telefone */}
                  <div className="phone-info">
                    <Phone size={14} />
                    <span>{c.phone || "Não informado"}</span>
                  </div>

                  {/* 💬 botão whatsapp */}
                  {c.phone && (
                    <a
                      href={`https://wa.me/55${(c.phone ?? "").replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-button"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}

                </div>
              </div>

              <div className="card-actions">
                <button onClick={() => toggleConfirmacao(c)}>
                  {c.status === "sim"
                    ? "Marcar como não vai"
                    : "Marcar como vai"}
                </button>

                <button onClick={() => handleDeleteConfirmacao(c.id)}>
                  Excluir
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}