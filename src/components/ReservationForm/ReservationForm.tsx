import "./ReservationForm.css";
import type { Dispatch, SetStateAction } from "react";

type FormData = {
  name: string;
  phone: string;
};

type Props = {
  itemName: string;
  form: FormData;
  setForm: Dispatch<SetStateAction<FormData>>;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean; // 👈 ESSENCIAL
};

export function ReservationForm({ itemName, form, setForm, onConfirm, onClose, loading }: Props) {
  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose} />

      <div className="modal__content">
        <div className="modal__header"> 
        <h2 className="modal__title">Presentear: {itemName}</h2>
         {/* <button className="modal__close" onClick={onClose}>
          ✕
        </button> */}
        </div>
     

        <input
          className="modal__input"
          placeholder="Seu nome"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="modal__input"
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
        <button
            className="modal__button"
            onClick={onConfirm}
            disabled={loading}
            >
            {loading ? "Salvando..." : "Confirmar"}
            </button>
      </div>
    </div>
  );
}