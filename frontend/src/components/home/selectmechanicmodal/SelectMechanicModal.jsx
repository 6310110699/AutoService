import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "./SelectMechanicModal.scss";

const SelectMechanicModal = ({
  showSelectMechanicModal,
  handleSelectMechanicModalClose,
  mechanics,
  selectedMechanics,
  handleSelectMechanic,
  handleAddMechanic,
  editingCustomerId
}) => {

  const [showConfirmCancelEditMechanicModal, setShowConfirmCancelEditMechanicModal] = useState(false);

  const [searchMechanic, setSearchMechanic] = useState('');

  const filteredMechanics = mechanics.filter((mechanic) => {
    return mechanic.name.toLowerCase().includes(searchMechanic.toLowerCase()) 
  });

  const handleConfirmCancelEditMechanicModalClose = () => {
    setShowConfirmCancelEditMechanicModal(false);
  }

  const handleCancelUpdateMechanic = () => {
    handleConfirmCancelEditMechanicModalClose();
    handleSelectMechanicModalClose();
  };

  return (
    <div>
      <Modal
        className='selectmechanicmodal'
        show={showSelectMechanicModal}
        onHide={handleSelectMechanicModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ช่างที่ทำการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className='mechanic-searchbox'>
              <input
                type="text"
                id="input-with-icon-adornment"
                value={searchMechanic}
                onChange={(e) => setSearchMechanic(e.target.value)}
                placeholder="ค้นหาช่าง"
              />
            </div>

            <ul className='mechanic-choice'>
              {filteredMechanics.map((mechanic) => (
                <div key={mechanic._id} value={mechanic.name}>
                  <span>
                    <input
                      type="checkbox"
                      checked={selectedMechanics.includes(mechanic._id)}
                      onChange={() => handleSelectMechanic(mechanic._id)}
                    />
                  </span>
                  <span className="mechanic-label">
                    <div className="mechanic-name">
                      {mechanic.name}
                    </div>
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={setShowConfirmCancelEditMechanicModal}>
            CANCEL
          </div>
          <div className='button-yes' onClick={() => handleAddMechanic(editingCustomerId)}>
            SAVE
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        className='confirmcanceleditmechanicmodal'
        show={showConfirmCancelEditMechanicModal}
        onHide={handleConfirmCancelEditMechanicModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการแก้ไข</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการยกเลิกแก้ไขข้อมูลพนักงาานที่ทำการซ่อม
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmCancelEditMechanicModalClose}>
            NO
          </div>

          <div className='button-yes' onClick={handleCancelUpdateMechanic}>
            YES
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectMechanicModal;
