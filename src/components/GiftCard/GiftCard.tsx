import type { GiftItem } from "../../types/GiftItem";
import "./GiftCard.css";
import type { CSSProperties } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  item: GiftItem;
  onSelect: (item: GiftItem) => void;
  onViewStores: (item: GiftItem) => void;
  style?: CSSProperties;
};

export function GiftCard({ item, onSelect, onViewStores, style }: Props) {
  const isFull = item.reserved.length >= item.total;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="gift-card" style={style}>
      
      <img
        src={item.image || "/images/sem_imagem.jpg"}
        alt={item.name}
        className="gift-card__image"
        onClick={() => setIsOpen(true)}
      />

      <h2 className="gift-card__title">{item.name}</h2>

      {item.color && (
        <p className="gift-card__info">Cor: {item.color}</p>
      )}
      {item.material && (
        <p className="gift-card__info">
          Material: {item.material}
        </p>
      )}

      {item.note && (
        <p className="gift-card__info">Obs: {item.note}</p>
      )}

      {/* 🔥 BOTÃO NOVO */}
      <button
        className="gift-card__button-secondary"
        onClick={() => onViewStores(item)}
      >
        Comparar preços 🛒
      </button>

      <p className="gift-card__progress">
        {item.reserved.length}/{item.total} presenteado
      </p>

      <button
        className={`gift-card__button ${
          isFull ? "gift-card__button--disabled" : ""
        }`}
        disabled={isFull}
        onClick={() => onSelect(item)}
      >
        {isFull ? "Esgotado" : "Presentear"}
      </button>

      {/* 🔍 MODAL DE IMAGEM */}
      {isOpen &&
        createPortal(
          <div className="image-modal" onClick={() => setIsOpen(false)}>
            
            <div
              className="image-modal__img-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.image || "/images/sem_imagem.jpg"}
                className="image-modal__img"
              />
            </div>

            <button
              className="image-modal__close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

          </div>,
          document.body
        )}
    </div>
  );
}