import React, { useState } from "react";

function Lifelines({ onUseLifeline }) {
  const [lifelinesUsed, setLifelinesUsed] = useState(0);

  const handleUseLifeline = () => {
    if (lifelinesUsed < 1) {
      onUseLifeline();
      setLifelinesUsed(lifelinesUsed + 1);
    } else {
      alert("Wykorzystałeś już wszystkie koła ratunkowe!");
    }
  };

  return (
    <div>
      <button onClick={handleUseLifeline}>Koło ratunkowe</button>
      <p>Pozostałe koła ratunkowe: {1 - lifelinesUsed}</p>
    </div>
  );
}

export default Lifelines;
