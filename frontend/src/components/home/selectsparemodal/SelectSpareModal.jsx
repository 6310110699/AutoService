import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "./SelectSpareModal.scss";

const SelectSpareModal = ({
  showSparePartsModal,
  handleSelectSparePartModalClose,
  spareParts,
  handleSaveSpareParts,
  selectedSparePartsByService,
  currentStepServiceId,
  handleSelectSparePart
}) => {

  const [showConfirmCancelEditSpareModal, setShowConfirmCancelEditSpareModal] = useState(false);

  const [searchSpare, setSearchSpare] = useState('');

  const filteredSpares = spareParts.filter((sparePart) => {
    return sparePart.spareName.toLowerCase().includes(searchSpare.toLowerCase())
  });

  const handleConfirmCancelEditSpareModalClose = () => {
    setShowConfirmCancelEditSpareModal(false);
  }

  const handleCancelUpdateSpare = () => {
    handleConfirmCancelEditSpareModalClose();
    handleSelectSparePartModalClose();
  };

  return (
    <div>
      <Modal
        className='selectsparemodal'
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
          <div className='spare-searchbox'>
            <input
              type="text"
              id="input-with-icon-adornment"
              value={searchSpare}
              onChange={(e) => setSearchSpare(e.target.value)}
              placeholder="ค้นหาอะไหล่"
            />
          </div>

          <ul className='spare-choice'>
            {filteredSpares.map((sparePart) => (
              <div key={sparePart._id}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedSparePartsByService[currentStepServiceId]?.some(sparePartData => sparePartData.sparePartId === sparePart._id)}
                    onChange={() => handleSelectSparePart(sparePart._id)}
                  />
                </span>
                <span className="spare-label">
                  <div className="spare-name">
                    {sparePart.spareName}
                  </div>
                </span>
              </div>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={setShowConfirmCancelEditSpareModal}>
            CANCEL
          </div>
          <div className='button-yes' onClick={handleSaveSpareParts}>
            SAVE
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        className='confirmcanceleditsparemodal'
        show={showConfirmCancelEditSpareModal}
        onHide={handleConfirmCancelEditSpareModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการแก้ไข</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการยกเลิกแก้ไขอะไหล่
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmCancelEditSpareModalClose}>
            NO
          </div>

          <div className='button-yes' onClick={handleCancelUpdateSpare}>
            YES
          </div>
        </Modal.Footer>
      </Modal>
    </div>

  );
};

export default SelectSpareModal;
