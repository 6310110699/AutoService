import React from 'react';
import Modal from 'react-bootstrap/Modal';

const StatusModal = ({  
    showStatusModal,
    handleStatusModalClose,
    selectedCustomerStatus,
    state1,
    state2,
    state3,
    state4,
    state5,
    setState2,
    setState3,
    setState4,
    setState5,
    handleToggleState,
    handleUpdateStatus,
    editingCustomerId 
}) => {

  return (
    <Modal
    show={showStatusModal}
    onHide={handleStatusModalClose}
    backdrop="static"
    size="xl"
    centered
  >
    <Modal.Body>
      <div>
        {selectedCustomerStatus && ( // ตรวจสอบว่ามีข้อมูลสถานะของลูกค้าที่ถูกเลือกหรือไม่
          <div className="status-header-container">
            <button className="status-header">
              {selectedCustomerStatus.car.brand}{" "}
              {selectedCustomerStatus.car.selectedModel}{" "}
              {selectedCustomerStatus.car.color}{" "}
              {selectedCustomerStatus.car.numPlate}
            </button>
          </div>
        )}
      </div>
      <div className="status-container">
        <div className="state">
          <div className={`state ${state1 ? "status-active" : "status"}`}>
            <div className="state-circle1"></div>
            <div className="state-circle2">
              <img src='./assets/image/car.png'></img>
            </div>
          </div>
          <button className="button-true">เรียบร้อย</button>
        </div>
        <div className="state">
          <div className={`state ${state2 ? "status-active" : "status"}`}>
            <div className="state-circle1"></div>
            <div className="state-circle2">
              <img src='./assets/image/state2.png'></img>
            </div>
          </div>
          <button
            onClick={() => {
              if (state1) {
                handleToggleState("state2");
              }
              if (state3 || state4 || state5) {
                setState2(false);
                setState3(false);
                setState4(false);
                setState5(false);
              }
            }}
            className={state2 ? "button-true" : "button-false"}
          >
            เรียบร้อย
          </button>
        </div>
        <div className="state">
          <div className={`state ${state3 ? "status-active" : "status"}`}>
            <div className="state-circle1"></div>
            <div className="state-circle2">
              <img src='./assets/image/state3.png'></img>
            </div>
          </div>
          <button
            onClick={() => {
              if (state2) {
                handleToggleState("state3");
              }
              if (state4 || state5) {
                setState3(false);
                setState4(false);
                setState5(false);
              }
            }}
            className={state3 ? "button-true" : "button-false"}
          >
            เรียบร้อย
          </button>
        </div>
        <div className="state">
          <div className={`state ${state4 ? "status-active" : "status"}`}>
            <div className="state-circle1"></div>
            <div className="state-circle2">
              <img src='./assets/image/state4.png'></img>
            </div>
          </div>
          <button
            onClick={() => {
              if (state3) {
                handleToggleState("state4");
              }
              if (state5) {
                setState4(false);
                setState5(false);
              }
            }}
            className={state4 ? "button-true" : "button-false"}
          >
            เรียบร้อย
          </button>
        </div>
        <div className="state">
          <div className={`state ${state5 ? "status-active" : "status"}`}>
            <div className="state-circle1"></div>
            <div className="state-circle2">
              <img src='./assets/image/state5.png'></img>
            </div>
          </div>
          <button
            onClick={() => {
              if (state4) {
                handleToggleState("state5");
              }
            }}
            className={state5 ? "button-true" : "button-false"}
          >
            เรียบร้อย
          </button>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button
        type="button"
        onClick={() => handleUpdateStatus(editingCustomerId)}
        className="status-save"
      >
        SAVE
      </button>
      <button
        type="button"
        onClick={handleStatusModalClose}
        className="status-cancel"
      >
        CANCEL
      </button>
    </Modal.Footer>
  </Modal>
  );
};

export default StatusModal;
