import React from 'react';
import Modal from 'react-bootstrap/Modal';

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

  return (
    <Modal
        show={showSelectServiceModal}
        onHide={handleSelectServiceModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>สรุปรายการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStep === 1 && (
            <div>
              <ul>
                {services.map((service) => (
                  <div key={service._id} value={service.serviceName}>
                    <span style={{ display: "inline-block" }}>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleSelectService(service._id)}
                      />
                    </span>
                    <span style={{ display: "inline-block" }}>
                      <label className="form-control">
                        {service.serviceName}
                      </label>
                    </span>

                  </div>
                ))}
              </ul>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <ul>
                {services
                  .filter((service) => selectedServices.includes(service._id))
                  .map((selectedService) => (
                    <li key={selectedService._id}>
                      <div>
                        {selectedService.serviceName}
                      </div>
                      <ul>
                        <table style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>อะไหล่</th>
                              <th>จำนวน</th>
                              <th>ราคา</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSparePartsForService[selectedService._id]?.map((selectedSparePartId) => {
                              const sparePart = spareParts.find((sparePart) =>
                                sparePart._id === selectedSparePartId
                                || sparePart._id === selectedSparePartId.sparePartId);
                              return (
                                <tr key={sparePart._id}>
                                  <td>
                                    <span>
                                      {sparePart.spareName}
                                    </span>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={selectedSparePartId.quantity}
                                      onChange={(e) => handleQuantityChange(selectedService._id, selectedSparePartId.sparePartId, e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <span>
                                      {sparePart.sparePrice}
                                    </span>
                                  </td>
                                  <td>
                                    <span className='delete-carregis' onClick={() => handleDeleteSparePart(selectedService._id, sparePart._id)}>
                                      <img src='./assets/image/bin.png' />
                                    </span>
                                  </td>

                                </tr>

                              );
                            })}
                          </tbody>

                        </table>

                      </ul>
                      <div className='add-button' onClick={() => handleEditSpareParts(selectedService)}>
                        เพิ่มอะไหล่
                      </div>
                    </li>
                  ))}
              </ul>
              <div>
                <table style={{ margin: "50px" }}>
                  <tbody>
                    <td style={{ width: "40%" }}>
                      <h4>
                        ค่าบริการ
                      </h4></td>
                    <td style={{ width: "20%" }}>
                      <input
                        type="number"
                        className="form-control"
                        value={serviceFee}
                        onChange={(e) => setServiceFee(e.target.value)}
                      />
                    </td>

                  </tbody>
                </table>

              </div>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <div>
            {currentStep === 1 && (
              <>
                <div className="cancel-button" onClick={handleSelectServiceModalClose}>
                  CANCEL
                </div>
                <button className="save-button" onClick={handleNextStep}>
                  NEXT
                </button>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="cancel-button" onClick={handlePreviousStep}>
                  BACK
                </div>
                <div className="save-button" onClick={() => handleAddService(editingCustomerId)}>
                  SAVE
                </div>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
  );
};

export default SelectServiceModal;
