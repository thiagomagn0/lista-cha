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
import { useToast } from "../../hooks/useToast";


const initialItems: GiftItem[] = [
  { id: 1, name: "Porta condimentos", image: "/images/porta_condimentos.jpeg", store: "", color: "Natural", material: "Bambu", note: "", price: 89.9, total: 1, reserved: [] },
  { id: 2, name: "Pano de prato", image: "", store: "", color: "Branco", material: "Algodão", note: "", price: 12.9, total: 5, reserved: [] },
  { id: 3, name: "Cortina", image: "", store: "", color: "Bege", material: "Linho", note: "", price: 79.9, total: 2, reserved: [] },
  { id: 4, name: "Cafeteira", image: "", store: "", color: "Preta", material: "Inox", note: "", price: 149.9, total: 1, reserved: [] },
  { id: 5, name: "Sanduicheira", image: "", store: "", color: "Preta", material: "Antiaderente", note: "", price: 119.9, total: 1, reserved: [] },
  { id: 6, name: "Jogo de cama casal", image: "", store: "", color: "Branco", material: "Algodão", note: "", price: 159.9, total: 5, reserved: [] },
  { id: 7, name: "Toalha", image: "", store: "", color: "Cinza", material: "Algodão", note: "", price: 39.9, total: 5, reserved: [] },
  { id: 8, name: "Jogo de banheiro", image: "", store: "", color: "Bege", material: "Algodão", note: "", price: 59.9, total: 5, reserved: [] },
  { id: 9, name: "Processador", image: "", store: "", color: "Preto", material: "Plástico", note: "", price: 199.9, total: 1, reserved: [] },
  { id: 10, name: "Batedeira", image: "", store: "", color: "Branca", material: "Plástico", note: "", price: 179.9, total: 1, reserved: [] },
  { id: 11, name: "Jogo de pratos", image: "", store: "", color: "Branco", material: "Porcelana", note: "", price: 129.9, total: 3, reserved: [] },
  { id: 12, name: "Taça gin", image: "", store: "", color: "Transparente", material: "Vidro", note: "", price: 29.9, total: 1, reserved: [] },
  { id: 13, name: "Varal de chão", image: "", store: "", color: "Prata", material: "Alumínio", note: "", price: 139.9, total: 1, reserved: [] },
  { id: 14, name: "Pano de chão", image: "", store: "", color: "Branco", material: "Algodão", note: "", price: 9.9, total: 10, reserved: [] },
  { id: 15, name: "Prensa francesa", image: "", store: "", color: "Preta", material: "Vidro", note: "", price: 69.9, total: 1, reserved: [] },
  { id: 16, name: "Faqueiro", image: "", store: "", color: "Prata", material: "Inox", note: "", price: 149.9, total: 1, reserved: [] },
  { id: 17, name: "Panela de pressão", image: "", store: "", color: "Prata", material: "Alumínio", note: "", price: 129.9, total: 1, reserved: [] },
  { id: 18, name: "Saca rolhas", image: "", store: "", color: "Preto", material: "Metal", note: "", price: 24.9, total: 1, reserved: [] },
  { id: 19, name: "Varão de cortina", image: "", store: "", color: "Prata", material: "Aço", note: "", price: 59.9, total: 2, reserved: [] },
  { id: 20, name: "Tapete (casa)", image: "", store: "", color: "Bege", material: "Poliéster", note: "", price: 99.9, total: 2, reserved: [] },
  { id: 21, name: "Mop com spray", image: "", store: "", color: "Cinza", material: "Plástico", note: "", price: 89.9, total: 1, reserved: [] },
  { id: 22, name: "Cesto de roupa", image: "", store: "", color: "Branco", material: "Plástico", note: "", price: 69.9, total: 1, reserved: [] },
  { id: 23, name: "Organizador multiuso", image: "", store: "", color: "Transparente", material: "Plástico", note: "", price: 49.9, total: 1, reserved: [] },
  { id: 24, name: "Rede", image: "", store: "", color: "Bege", material: "Algodão", note: "", price: 119.9, total: 1, reserved: [] },
  { id: 25, name: "Kit pote hermético", image: "", store: "", color: "Transparente", material: "Plástico", note: "", price: 79.9, total: 1, reserved: [] },
  { id: 26, name: "Porta frios", image: "", store: "", color: "Transparente", material: "Plástico", note: "", price: 39.9, total: 3, reserved: [] },
  { id: 27, name: "Escova de limpeza", image: "", store: "", color: "Branca", material: "Plástico", note: "", price: 19.9, total: 3, reserved: [] },
  { id: 28, name: "Galheteiro", image: "", store: "", color: "Transparente", material: "Vidro", note: "", price: 49.9, total: 1, reserved: [] },
  { id: 29, name: "Porta guardanapo", image: "", store: "", color: "Natural", material: "Bambu", note: "", price: 34.9, total: 2, reserved: [] },
  { id: 30, name: "Organizador de armário", image: "", store: "", color: "Branco", material: "Plástico", note: "", price: 59.9, total: 5, reserved: [] },
  { id: 31, name: "Forma cupcake silicone", image: "", store: "", color: "Colorido", material: "Silicone", note: "", price: 29.9, total: 2, reserved: [] },
  { id: 32, name: "Kit de banheiro", image: "", store: "", color: "Branco", material: "Cerâmica", note: "", price: 89.9, total: 2, reserved: [] },
  { id: 33, name: "Jogo de Panelas", image: "/images/jogo_panela_tramontina.jpeg", store: "", color: "Preto", material: "Antiaderente", note: "", price: 299.9, total: 1, reserved: [] },
];
export default function Lista() {
  const [items, setItems] = useState<GiftItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const { showToast } = useToast(); // ✅ AGORA NO LUGAR CERTO
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
const handleViewStores = (item: GiftItem) => {
  const query = [
    item.name,
    item.color,
    item.material
  ]
    .filter(Boolean)
    .join(" ");

  setStoreQuery(query);
  setShowStoresModal(true);
};

  const handleSelectItem = (item: GiftItem) => {
    setSelectedItem(item);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

 const handleReserve = async (isPix = false) => {
  // 🔒 validação básica
  if (!form.name.trim() || !form.phone.trim()) {
    showToast("Preencha todos os campos 😢", "error");
    return;
  }

  // 🔒 valida item selecionado
  if (!selectedItem) {
    showToast("Selecione um presente primeiro 🎁", "error");
    return;
  }

  // 🔒 valida telefone (já mascarado)
  if (form.phone.replace(/\D/g, "").length < 10) {
    showToast("Telefone inválido 😢", "error");
    return;
  }

  try {
    setLoading(true);

      // 🔥 AQUI ENTRA A VALIDAÇÃO DE DUPLICIDADE
    const snapshot = await getDocs(collection(db, "reservas"));

    const alreadyReserved = snapshot.docs.some((doc) => {
      const data = doc.data();
      return (
        data.item === selectedItem.name &&
        data.phone === form.phone
      );
    });

    if (alreadyReserved) {
      showToast("Você já reservou este item 😅", "error");
      return;
    }

 await addDoc(collection(db, "reservas"), {
  item: selectedItem.name,
  name: form.name.trim(),
  phone: form.phone,
  status: "pendente",

  type: isPix ? "pix" : "presente", // 🔥 NOVO
  price: selectedItem.price || 0,   // 🔥 NOVO (se tiver)

  createdAt: new Date(),
});

    await fetchReservas();

    // 🧹 reset
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

    // ✅ feedback final
    showToast("Presente reservado com sucesso 🎉", "success");

  } catch (error) {
    console.error("ERRO:", error);
    showToast("Erro ao enviar presente 😢", "error");
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
    <div className="lista fade-page">
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