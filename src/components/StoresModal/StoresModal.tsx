
import "./StoreModal.css";
import { useEffect, useState } from "react"
type Props = {
  query: string;
  onClose: () => void;
};

export function StoresModal({ query, onClose }: Props) {
  const encoded = encodeURIComponent(query);

  const recommended = [
    {
      name: "Google Shopping",
      url: `https://www.google.com/search?tbm=shop&hl=pt-BR&gl=BR&q=${encoded}`,
      icon: "/icons/google.jpg",
    },
  ];

  const stores = [
    {
      name: "Mercado Livre",
      url: `https://lista.mercadolivre.com.br/${encoded}`,
      icon: "/icons/mercado-livre.svg",
    },
    {
      name: "Amazon",
      url: `https://www.amazon.com.br/s?k=${encoded}`,
      icon: "/icons/amazon.jpg",
    },
  ];
  const [closing, setClosing] = useState(false);
   useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

const handleClose = () => {
  // 📳 vibração segura
  if ("vibrate" in navigator) {
    navigator.vibrate([20, 40, 20]);
  }

  setClosing(true);

  setTimeout(() => {
    onClose();
  }, 300);
};


  return (
   <div className={`sheet-overlay ${closing ? "fade-out" : ""}`} onClick={handleClose}>
  <div
    className={`sheet ${closing ? "slide-down" : ""}`}
    onClick={(e) => e.stopPropagation()}
  >

        <div className="sheet-handle" />

        <h2 className="sheet-title">Onde comprar 🛒</h2>

        {/* 🔥 RECOMENDADO */}
        <p className="sheet-section">Recomendado</p>

        {recommended.map((store) => (
          <button
            key={store.name}
            className="sheet-item highlight"
            onClick={() => window.open(store.url, "_blank")}
          >
            <div className="sheet-left">
              <img src={store.icon} className="sheet-logo" />
              <div>
                <p className="sheet-name">{store.name}</p>              
              </div>
            </div>

            <div className="sheet-right">
              <span className="sheet-action">Abrir mapa</span>
              <span className="sheet-arrow">›</span>
            </div>
          </button>
        ))}

        {/* 🔥 OUTRAS LOJAS */}
        <p className="sheet-section">Outras lojas</p>
        <div className="content__sheet-item">
            {stores.map((store) => (
                <button
                    key={store.name}
                    className="sheet-item"
                    onClick={() => window.open(store.url, "_blank")}
                >
                    <div className="sheet-left">
                    <img src={store.icon} className="sheet-logo" />
                    <div>
                        <p className="sheet-name">{store.name}</p>               
                    </div>
                    </div>

                    <div className="sheet-right">
                    <span className="sheet-action">Abrir loja</span>
                    <span className="sheet-arrow">›</span>
                    </div>
                </button>
                ))}
        </div>
   

        <button className="sheet-close" onClick={handleClose}>
  Fechar
</button>
      </div>
    </div>
  );
}