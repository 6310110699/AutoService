import React from 'react';
import Modal from 'react-bootstrap/Modal';

const SelectSpareModal = ({ 
    showSparePartsModal,
    handleSelectSparePartModalClose,
    spareParts,
    handleSaveSpareParts,
    selectedSparePartsByService,
    currentStepServiceId,
    handleSelectSparePart
}) => {

  return (
    <Modal
        show={showSparePartsModal}
        onHide={handleSelectSparePartModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มอะไหล่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {spareParts.map((sparePart) => (
              <li key={sparePart._id}>
                <input
                  type="checkbox"
                  checked={selectedSparePartsByService[currentStepServiceId]?.some(sparePartData => sparePartData.sparePartId === sparePart._id)}
                  onChange={() => handleSelectSparePart(sparePart._id)}
                />
                {sparePart.spareName}
              </li>
            ))}

          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div className="cancel-button" onClick={handleSelectSparePartModalClose}>
            CANCEL
          </div>
          <div className="save-button" onClick={handleSaveSpareParts}>
            SAVE
          </div>
        </Modal.Footer>
      </Modal>
  );
};

export default SelectSpareModal;
