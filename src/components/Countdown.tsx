
export default function Countdown() {
  const targetDate = new Date("2026-12-20");

  const diff =
    targetDate.getTime() - new Date().getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return (
    <div style={{ marginTop: 20 }}>
      Restam <strong>{days}</strong> dias para o evento.
    </div>
  );
}