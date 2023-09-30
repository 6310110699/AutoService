import React from 'react';
import Modal from 'react-bootstrap/Modal';

const SelectMechanicModal = ({ 
    showSelectMechanicModal, 
    handleSelectMechanicModalClose, 
    mechanics, 
    selectedMechanics, 
    handleSelectMechanic, 
    handleAddMechanic, 
    editingCustomerId 
}) => {

  return (
    <Modal show={showSelectMechanicModal} onHide={handleSelectMechanicModalClose} backdrop="static" size="xl" centered>
      <Modal.Header closeButton>
          <Modal.Title>ช่างที่ทำการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              {mechanics.map((mechanic) => (
                <div key={mechanic._id} value={mechanic.name}>
                  <span style={{ display: "inline-block" }}>
                    <input
                      type="checkbox"
                      checked={selectedMechanics.includes(mechanic._id)}
                      onChange={() => handleSelectMechanic(mechanic._id)}
                    />
                  </span>
                  <span style={{ display: "inline-block" }}>
                    <label className="form-control">
                      {mechanic.name}
                    </label>
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={() => handleAddMechanic(editingCustomerId)}>
            SAVE
          </button>
          <button type="button" onClick={handleSelectMechanicModalClose}>CANCEL</button>
        </Modal.Footer>
    </Modal>
  );
};

export default SelectMechanicModal;
