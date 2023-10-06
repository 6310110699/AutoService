import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "./SelectServiceModal.scss";

const SelectServiceModal = ({
  showSelectServiceModal,
  handleSelectServiceModalClose,
  currentStep,
  services,
  handleNextStep,
  selectedServices,
  handleSelectService,
  selectedSparePartsForService,
  serviceFee,
  handlePreviousStep,
  handleEditSpareParts,
  spareParts,
  handleQuantityChange,
  handleDeleteSparePart,
  setServiceFee,
  handleAddService,
  editingCustomerId
}) => {

  const [showConfirmCancelEditServiceModal, setShowConfirmCancelEditServiceModal] = useState(false);

  const [searchService, setSearchService] = useState('');

  const filteredServices = services.filter((service) => {
    return service.serviceName.toLowerCase().includes(searchService.toLowerCase())
  });

  const handleConfirmCancelEditServiceModalClose = () => {
    setShowConfirmCancelEditServiceModal(false);
  }

  const handleCancelUpdateService = () => {
    handleConfirmCancelEditServiceModalClose();
    handleSelectServiceModalClose();
  };

  return (
    <div>
      <Modal
        className='selectservicemodal'
        show={showSelectServiceModal}
        onHide={handleSelectServiceModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              {currentStep === 1 && (
                <>
                  รายการซ่อม
                </>
              )}
              {currentStep === 2 && (
                <>
                  สรุปรายการซ่อม
                </>
              )}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStep === 1 && (
            <div className='firststep'>
              <div className='service-searchbox'>
                <input
                  type="text"
                  id="input-with-icon-adornment"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  placeholder="ค้นหารายการซ่อม"
                />
              </div>

              <ul className='service-choice'>
                {filteredServices.map((service) => (
                  <div key={service._id} value={service.serviceName}>
                    <span className='input-checkbox'>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleSelectService(service._id)}
                      />
                    </span>
                    <span className="service-label">
                      <div className="service-name">
                        {service.serviceName}
                      </div>
                    </span>
                  </div>
                ))}
              </ul>
            </div>
          )}
          {currentStep === 2 && (
            <div className='secondstep'>
              <ul>
                {services
                  .filter((service) => selectedServices.includes(service._id))
                  .map((selectedService) => (
                    <div key={selectedService._id}>
                      <div className='selectservice-name'>
                        {selectedService.serviceName}
                      </div>
                      <ul>
                        <table className='selectservice-table'>
                          <tbody>
                            {selectedSparePartsForService[selectedService._id]?.map((selectedSparePartId) => {
                              const sparePart = spareParts.find((sparePart) =>
                                sparePart._id === selectedSparePartId
                                || sparePart._id === selectedSparePartId.sparePartId);
                              return (
                                <tr key={sparePart._id}>
                                  <td className='selectservice-spare'>
                                    {sparePart.spareName}
                                  </td>
                                  <td className='selectservice-quantity'>
                                    <input
                                      type="number"
                                      value={selectedSparePartId.quantity}
                                      onChange={(e) =>
                                        handleQuantityChange(selectedService._id, selectedSparePartId.sparePartId, e.target.value)}
                                    />
                                  </td>
                                  <td className='selectservice-price'>
                                    {sparePart.sparePrice}
                                  </td>
                                  <td className='delete-spare' onClick={() =>
                                    handleDeleteSparePart(selectedService._id, sparePart._id)}>
                                    <img src='./assets/image/bin.png' />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </ul>
                      <div className='add-spare' onClick={() => handleEditSpareParts(selectedService)}>
                        เพิ่มอะไหล่
                      </div>
                    </div>
                  ))}
              </ul>
              <div>
                <div className='servicefee-table'>
                  <div className='servicefee-label'>
                    ค่าบริการ
                  </div>
                  <div className='servicefee'>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceFee}
                      placeholder="กรอกค่าบริการ"
                      onChange={(e) => setServiceFee(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <div>
            {currentStep === 1 && (
              <>
                <div className="button-no" onClick={setShowConfirmCancelEditServiceModal}>
                  CANCEL
                </div>
                <div className="button-yes" onClick={handleNextStep}>
                  NEXT
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="button-no" onClick={handlePreviousStep}>
                  BACK
                </div>
                <div className="button-yes" onClick={() => handleAddService(editingCustomerId)}>
                  SAVE
                </div>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        className='confirmcanceleditservicemodal'
        show={showConfirmCancelEditServiceModal}
        onHide={handleConfirmCancelEditServiceModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการแก้ไข</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการยกเลิกแก้ไขรายการซ่อม
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmCancelEditServiceModalClose}>
            NO
          </div>

          <div className='button-yes' onClick={handleCancelUpdateService}>
            YES
          </div>
        </Modal.Footer>
      </Modal>
    </div>

  );
};

export default SelectServiceModal;
