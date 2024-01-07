import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import "./SelectSpareModal.scss";

const SelectSpareModal = ({
  showSparePartsModal,
  handleSelectSparePartModalClose,
  spareParts,
  handleSaveSpareParts,
  selectedSparePartsByService,
  currentStepServiceId,
  handleSelectSparePart,
  loadSpareParts,
  isFormEdited,
  setIsFormEdited
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
    setIsFormEdited(false);
  };

  const [spareName, setSpareName] = useState('');
  const [sparePrice, setSparePrice] = useState('');

  const handleAddOptionSpare = async () => {
    try {
      await axios.post('http://localhost:3001/spares', {
        spareName,
        sppareType: '',
        sparePrice,
      });

      loadSpareParts();
      setSpareName('');
      setSparePrice('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่:', error);
    }
  };

  const handleConfirmBackModal = () => {
    if (isFormEdited) {
      setShowConfirmCancelEditSpareModal(true);
    } else {
      handleSelectSparePartModalClose();
    }
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
                <span className='input-checkbox'>
                  <input
                    type="checkbox"
                    checked={selectedSparePartsByService[currentStepServiceId]?.some(sparePartData => sparePartData.sparePartId === sparePart.spareName)}
                    onChange={() => handleSelectSparePart(sparePart.spareName)}
                  />
                </span>
                <span className="spare-label">
                  <div className={`spare-name ${selectedSparePartsByService[currentStepServiceId]?.some(sparePartData => sparePartData.sparePartId === sparePart.spareName) ? 'selected' : 'not-selected'}`}>
                    {sparePart.spareName}
                  </div>
                </span>
              </div>
            ))}

            <div className='addoption'>
              <input
                type='text'
                placeholder='กรุณากรอกรุ่นอะไหล่'
                value={spareName}
                onChange={(e) => setSpareName(e.target.value)}
              />
              <input
                type='number'
                placeholder='กรุณากรอกราคา'
                value={sparePrice}
                onChange={(e) => setSparePrice(e.target.value)}
              />
              <div
                onClick={handleAddOptionSpare}
                className='addoption-button'
              >
                เพิ่ม
              </div>
            </div>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmBackModal}>
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
