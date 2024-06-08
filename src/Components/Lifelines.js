import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Lifelines({ onUseLifeline }) {
  const [lifelinesUsed, setLifelinesUsed] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleUseLifeline = () => {
    if (lifelinesUsed < 1) {
      onUseLifeline();
      setLifelinesUsed(lifelinesUsed + 1);
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <button onClick={handleUseLifeline} variant="secondary" >Lifeline</button>
      <p>Remaining lifelines: {1 - lifelinesUsed}</p>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>No Lifelines Left</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have already used all lifelines!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Lifelines;
