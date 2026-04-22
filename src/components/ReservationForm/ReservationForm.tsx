import "./ReservationForm.css";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

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
  const handlePhoneChange = (value: string) => {
    // remove tudo que não for número
    let numbers = value.replace(/\D/g, "");

    // limita a 11 dígitos
    numbers = numbers.slice(0, 11);

    // aplica máscara
    let formatted = numbers;

    if (numbers.length > 2) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length > 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }

    setForm({ ...form, phone: formatted });
  };
const [copied, setCopied] = useState(false);

const copyPix = async () => {
  await navigator.clipboard.writeText("71999999999");

  setCopied(true);

  setTimeout(() => {
    onClose();
  }, 500);
};

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
          autoFocus
          placeholder="Seu nome"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="modal__input"
          placeholder="Celular (Whatsapp)"
          value={form.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />
        <button
            className="modal__button"
            onClick={onConfirm}
            disabled={loading}
            >
            {loading ? "Salvando..." : "Confirmar"}
            </button>
              {/* 💰 PIX */}
             <div className="pix">
        <h3 className="pix__title">Prefere enviar um PIX? 💛</h3>

        <p className="pix__key">Chave: 71999999999</p>
          <QRCodeCanvas
            value="71999999999"
            size={160}
            bgColor="#ffffff"
            fgColor="#5c4b44"
            level="H"
          />
        <button className="pix__button" onClick={copyPix}>
          {copied ? "Copiado! 💛" : "Copiar chave PIX"}
        </button>
      </div>
      </div>
    
     
    </div>
  );
}