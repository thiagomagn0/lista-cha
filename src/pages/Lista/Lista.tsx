import { useState, useEffect } from "react";
import type { GiftItem } from "../../types/GiftItem";
import { GiftCard } from "../../components/GiftCard/GiftCard";
import { ReservationForm } from "../../components/ReservationForm/ReservationForm";
import { getDocs, collection, addDoc } from "firebase/firestore";
import type { Reserva } from "../../types/Reserva";
import "./Lista.css";
import { db } from "../../services/firebase";
import { ThankYouModal } from "../../components/AgradecimentoModal/AgradecimentoModal";
import confetti from "canvas-confetti";
import { StoresModal } from "../../components/StoresModal/StoresModal";

const initialItems: GiftItem[] = [
  { id: 1, name: "Porta condimentos", image: "/images/porta_condimentos.jpeg", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 2, name: "Pano de prato", image: "", store: "", color: "", note: "", total: 5, reserved: [] },
  { id: 3, name: "Cortina", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 4, name: "Cafeteira", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 5, name: "Sanduicheira", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 6, name: "Jogo de cama casal", image: "", store: "", color: "", note: "", total: 5, reserved: [] },
  { id: 7, name: "Toalha", image: "", store: "", color: "", note: "", total: 5, reserved: [] },
  { id: 8, name: "Jogo de banheiro", image: "", store: "", color: "", note: "", total: 5, reserved: [] },
  { id: 9, name: "Processador", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 10, name: "Batedeira", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 11, name: "Jogo de pratos", image: "", store: "", color: "", note: "", total: 3, reserved: [] },
  { id: 12, name: "Taça gin", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 13, name: "Varal de chão", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 14, name: "Pano de chão", image: "", store: "", color: "", note: "", total: 10, reserved: [] },
  { id: 15, name: "Prensa francesa", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 16, name: "Faqueiro", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 17, name: "Panela de pressão", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 18, name: "Saca rolhas", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 19, name: "Varão de cortina", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 20, name: "Tapete (casa)", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 21, name: "Mop com spray", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 22, name: "Cesto de roupa", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 23, name: "Organizador multiuso", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 24, name: "Rede", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 25, name: "Kit pote hermético", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 26, name: "Porta frios", image: "", store: "", color: "", note: "", total: 3, reserved: [] },
  { id: 27, name: "Escova de limpeza", image: "", store: "", color: "", note: "", total: 3, reserved: [] },
  { id: 28, name: "Galheteiro", image: "", store: "", color: "", note: "", total: 1, reserved: [] },
  { id: 29, name: "Porta guardanapo", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 30, name: "Organizador de armário", image: "", store: "", color: "", note: "", total: 5, reserved: [] },
  { id: 31, name: "Forma cupcake silicone", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 32, name: "Kit de banheiro", image: "", store: "", color: "", note: "", total: 2, reserved: [] },
  { id: 33, name: "Jogo de Panelas", image: "/images/jogo_panela_tramontina.jpeg", store: "", color: "", note: "", total: 1, reserved: [] },
];

export default function Lista() {
  const [items, setItems] = useState<GiftItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // 🔥 NOVO: modal de lojas
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");

  const playSound = () => {
    const audio = new Audio("/sounds/aplausos.wav");
    audio.volume = 0.3;
    audio.play();
  };

  // 🔥 FIREBASE
  const fetchReservas = async () => {
    const snapshot = await getDocs(collection(db, "reservas"));

    const reservas: Reserva[] = snapshot.docs.map(
      (doc) => doc.data() as Reserva
    );

    setItems((prevItems) =>
      prevItems.map((item) => {
        const reservasDoItem = reservas.filter(
          (r: Reserva) => r.item === item.name
        );

        return {
          ...item,
          reserved: reservasDoItem.map((r: Reserva) => ({
            name: r.name,
            phone: r.phone,
          })),
        };
      })
    );
  };

  // 🔥 NOVO: abrir modal de lojas
  const handleViewStores = (itemName: string) => {
    setStoreQuery(itemName);
    setShowStoresModal(true);
  };

  const handleSelectItem = (item: GiftItem) => {
    setSelectedItem(item);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleReserve = async () => {
    if (!form.name || !form.phone) {
      alert("Preencha todos os campos");
      return;
    }

    if (!selectedItem) return;

    if (form.phone.length < 10) {
      alert("Telefone inválido");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "reservas"), {
        item: selectedItem.name,
        name: form.name,
        phone: form.phone,
        createdAt: new Date(),
      });

      await fetchReservas();

      setForm({ name: "", phone: "" });
      setSelectedItem(null);

      // 🎉 efeitos
      confetti({ particleCount: 80, spread: 70, zIndex: 9999 });

      setTimeout(() => {
        confetti({ particleCount: 50, spread: 100, zIndex: 9999 });
      }, 700);

      playSound();

      setShowThankYou(true);

      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);

    } catch (error) {
      console.error("ERRO:", error);
      alert("Erro ao salvar 😢");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    const snapshot = await getDocs(collection(db, "reservas"));

    if (!mounted) return;

    const reservas: Reserva[] = snapshot.docs.map(
      (doc) => doc.data() as Reserva
    );

    setItems((prevItems) =>
      prevItems.map((item) => {
        const reservasDoItem = reservas.filter(
          (r) => r.item === item.name
        );

        return {
          ...item,
          reserved: reservasDoItem.map((r) => ({
            name: r.name,
            phone: r.phone,
          })),
        };
      })
    );
  };

  loadData();

  return () => {
    mounted = false;
  };
}, []);

  return (
    <div className="lista">
      <div className="liata__container">

        <header className="lista__header">
          <h1 className="lista__title">Lista de Presentes</h1>
          <p className="lista__subtitle">Escolha com carinho!</p>
        </header>

        <div className="lista__grid">
          {items.map((item, index) => (
            <GiftCard
              key={item.id}
              item={item}
              onSelect={handleSelectItem}
              onViewStores={handleViewStores} // 🔥 AQUI MUDOU              
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>

        {selectedItem && (
          <ReservationForm
            itemName={selectedItem.name}
            form={form}
            setForm={setForm}
            onConfirm={handleReserve}
            onClose={() => setSelectedItem(null)}
            loading={loading}
          />
        )}

        <ThankYouModal
          isOpen={showThankYou}
          onClose={() => setShowThankYou(false)}
        />
      </div>

      {/* 🔥 NOVO MODAL DE LOJAS */}
      {showStoresModal && (
        <StoresModal
          query={storeQuery}
          onClose={() => setShowStoresModal(false)}
        />
      )}
    </div>
  );
}