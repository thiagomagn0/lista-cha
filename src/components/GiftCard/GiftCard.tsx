import type { GiftItem } from "../../types/GiftItem";
import "./GiftCard.css";
import type { CSSProperties } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  item: GiftItem;
  onSelect: (item: GiftItem) => void;
  style?: CSSProperties;
};

export function GiftCard({ item, onSelect, style }: Props) {
  const isFull = item.reserved.length >= item.total;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="gift-card" style={style}>
      <img
        src={item.image}
        alt={item.name}
        className="gift-card__image"
        onClick={() => setIsOpen(true)}
      />

      <h2 className="gift-card__title">{item.name}</h2>

      <p className="gift-card__info">Cor: {item.color}</p>
      <p className="gift-card__info">Obs: {item.note}</p>

      <a
        href={item.store}
        target="_blank"
        className="gift-card__link"
      >
        Ver loja
      </a>

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
     {isOpen &&
  createPortal(
    <div className="image-modal" onClick={() => setIsOpen(false)}>
      
      <div
        className="image-modal__img-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
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
  )
}
    </div>
    
  );
}