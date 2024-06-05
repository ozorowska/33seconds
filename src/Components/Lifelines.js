import React, { useState } from "react";

function Lifelines({ onUseLifeline }) {
  const [lifelinesUsed, setLifelinesUsed] = useState(0);

  const handleUseLifeline = () => {
    if (lifelinesUsed < 1) {
      onUseLifeline();
      setLifelinesUsed(lifelinesUsed + 1);
    } else {
      alert("You have already used all lifelines!");
    }
  };

  return (
    <div>
      <button onClick={handleUseLifeline}>Lifeline</button>
      <p>Remaining lifelines: {1 - lifelinesUsed}</p>
    </div>
  );
}

export default Lifelines;
