import React from 'react';
import Modal from 'react-bootstrap/Modal';

const EditCarRegistrationModal = ({ 
  showCarRigisterModal,
  handleAddCustomerModalClose,
  message,
  numPlate,
  lineId,
  brand,
  brandmodels,
  customerName,
  selectedModel,
  customModel,
  phoneNumber,
  selectedColor,
  customColor,
  startdate,
  handleBrandChange,
  uniqueCustomerNames,
  handleModelChange,
  handleColorChange,
  colors,
  setStartDate,
  handleUpdateCustomer,
  editingCustomerId,
  setNumPlate,
  setLineId,
  setCustomerName,
  setCustomModel,
  setPhoneNumber,
  setCustomColor
}) => {

  return (
    <Modal
        show={showCarRigisterModal}
        onHide={handleAddCustomerModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลลูกค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="">

              {message && <div className="message">{message}</div>}

              <form className='customer-form'>
                <div className='row'>
                  <div className='col col-6'>
                    <label>ป้ายทะเบียน เช่น XX 0000 NARATHIWAT</label>
                    <input
                      type="text"
                      className="form-control"
                      value={numPlate}
                      onChange={(e) => setNumPlate(e.target.value)}
                    />
                  </div>
                  <div className='col col-6'>
                    <label>LINE ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>ยี่ห้อรถ:</label>
                    <select className="form-control" value={brand} onChange={handleBrandChange}>
                      <option value="">กรุณาเลือก</option>
                      {Array.from(new Set(brandmodels.map((brandmodel) => brandmodel.brand))).map((uniqueBrand) => (
                        <option key={uniqueBrand} value={uniqueBrand}>
                          {uniqueBrand}
                        </option>
                      ))}
                      <option value="other">อื่นๆ</option>
                    </select>
                    {brand === 'other' && (
                      <input
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="กรอกยี่ห้อรถ"
                      />
                    )}
                  </div>
                  <div className='col col-6'>
                    <label>ชื่อลูกค้า:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerName}
                      list='customerNamesList'
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <datalist id="customerNamesList">
                      {uniqueCustomerNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>

                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>รุ่นรถ:</label>
                    <select
                      className="form-control"
                      value={selectedModel}
                      onChange={handleModelChange}
                    >
                      <option value="">กรุณาเลือก</option>
                      {brandmodels
                        .filter((brandmodel) => brandmodel.brand === brand)
                        .map((brandmodel) => (
                          <option key={brandmodel._id} value={brandmodel.model}>
                            {brandmodel.model}
                          </option>
                        ))}
                      <option value="custom-model">
                        {customModel ? customModel : 'กรุณากรอกรุ่นรถ'}
                      </option>
                    </select>
                    {selectedModel === 'custom-model' && (
                      <>
                        <input
                          type="text"
                          value={customModel}
                          onChange={(e) => setCustomModel(e.target.value)}
                          placeholder="กรอกรุ่นรถ"
                        />
                      </>
                    )}
                  </div>
                  <div className='col col-6'>
                    <label>เบอร์โทรศัพท์:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col col-6'>
                    <label>สี:</label>
                    <select
                      className="form-control"
                      value={selectedColor}
                      onChange={handleColorChange}
                    >
                      <option value="">กรุณาเลือก</option>
                      {colors
                        .map((color) => (
                          <option key={color._id} value={color.colorname}>
                            {color.colorname}
                          </option>
                        ))}
                      <option value="custom-color">
                        {customColor ? customColor : 'กรุณากรอกสีรถ'}
                      </option>
                    </select>
                    {selectedColor === 'custom-color' && (
                      <>
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="กรอกสีรถ"
                        />
                      </>
                    )}
                  </div>
                  <div className='col col-6'>
                    <label>วันที่:</label>
                    <input
                      type="datetime-local"
                      value={startdate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={() => handleUpdateCustomer(editingCustomerId)}>
            แก้ไข
          </button>
          <button type="button" onClick={handleAddCustomerModalClose}>ยกเลิก</button>
        </Modal.Footer>
      </Modal>
  )
};

export default EditCarRegistrationModal;
