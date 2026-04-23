import "./Evento.css";



export default function Evento() {

 const openWaze = () => {
    const appUrl = "waze://?q=Av.+Boa+Esperança,+Salvador";
    const fallback = "https://waze.com/ul?q=Av.+Boa+Esperança,+Salvador&navigate=yes";

    window.location.href = appUrl;

    setTimeout(() => {
      window.open(fallback, "_blank");
    }, 800);
  };

  return (
    <div className="evento fade-page">
      <div className="evento__container">

        <h1 className="evento__title">Local do Evento</h1>

        <p className="evento__subtitle">
          Esperamos por você.
        </p>

        <div className="evento__card">
          <p className="evento__address">
            Av. Boa Esperança <br /> São Gonçalo Nº 99 <br />
            Salvador - BA <br />
            CEP: 41185-010
          </p>

          <iframe
            className="evento__map"
            src="https://www.google.com/maps?q=Av.+Boa+Esperança,+São+Gonçalo,+Salvador+BA&output=embed"
            loading="lazy"
          />
       <div className="evento__actions">

  <a
    href="https://www.google.com/maps?q=Av.+Boa+Esperança,+São+Gonçalo,+Salvador+BA"
    target="_blank"
    className="evento__button"
  >
    
    Abrir no Google Maps
    <img src="/images/google_maps.png" className="evento__icon-img" />
  </a>

  <a
    onClick={openWaze}
    className="evento__button evento__button--waze"
  >
    
    Abrir no Waze
    <img src="/images/waze.png" className="evento__icon-img" />
  </a>

</div>
        </div>

      </div>
    </div>
  );
}