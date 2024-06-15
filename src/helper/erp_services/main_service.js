const axios = require('axios')
var log4js = require('../../config/logger')
var errorLogs = log4js.getLogger('errors')
var FormData = require('form-data');
const fs = require("fs");
const path = require('path')

var getDateTime = require('../../helper/common').getDateTime

const fetch = require('node-fetch');
//TODO change erp host ip to public before deploy
const erpHost = process.env.ERP_HOST === undefined ? 'http://10.15.64.2:443' : process.env.ERP_HOST
// const erpHost = 'http://109.224.7.69:777'

function uploadImage(imageBuffer) {
  const form = new FormData();
  form.append('file', imageBuffer, {
    contentType: 'image/jpeg',
    filename: 'dummy.jpg',
  });

};

// var token= "d72cdaeef89361f10f3548fcdd293d4f010890BF6B8E547B0DDB620664793847B4E2D553"
var token = process.env.ERP_API_TOKEN === undefined ? "6a3a6b0e039d06131c02d613f778467c456F88DDCA314D97279860A768BD8F3915175F98" : process.env.ERP_API_TOKEN
// var sidRequestTime = 1000 * 20 * 1 //1 min
function makeRequestWithFile(url, object, callback) {


  var data = new FormData();
  data.append('mission_id', object.mission_id);
  data.append('submission_id', object.submission_id);

  let imageCounter = 0
  if (object && object.sub_missions && object.sub_missions.length > 0) {
    var defaultDate = new Date()
    var dateTime = getDateTime(defaultDate.toString(), "y_m_d_H_M_S")
    object.sub_missions.forEach(submission => {

      if (submission && submission.images && submission.images.length > 0) {
        submission.images.forEach(image => {
          const targetPath = path.join(__dirname, "/../../../dist/uploads/missions/sub_missions/" + image.uri);

          try {
            if (fs.existsSync(targetPath)) {
              if (fs.lstatSync(targetPath).isFile()) {
                let imageBuffer = fs.createReadStream(targetPath)
                // console.log("imageBuffer",imageBuffer);
                if (imageBuffer) {
                  let imageTitle = image.type
                  if (image.sub_image_type_id == 0 && image.title) {
                    imageTitle = image.title
                  }
                  // console.log("targetPath", targetPath);

                  let fileName = dateTime + "-" + submission.id + "-" + imageTitle + "" + imageCounter + ".jpg"

                  // console.log("fileName", fileName);
                  imageCounter++
                  data.append('file[]', imageBuffer, {
                    contentType: 'image/jpg',
                    filename: fileName,
                  });
                }
              }


            }

          } catch (error) {
            console.log("no image", error.message);
          }

        })
      }
    });
  }

  var config = {
    method: 'post',
    url: erpHost + url,//'http://109.224.7.69:777/my_inventory.php',
    headers: {
      'Authorization': token,
      "Content-Type": "multipart/form-data",
      ...data.getHeaders()
    },
    data: data,
    timeout:60000
  };

  axios(config)

    .then(function (response) {


      if (response.data.hasOwnProperty('error')) {
        callback({ status: false, data: response.data })
      }
      else callback({ status: true, data: response.data })
    })
    .catch(function (error) {

      console.log("error catch")
      callback(error.message);
      errorLogs.error("error", error.message)
    })
    .finally(function () {

      // console.log("in final");

    });
}
function makeRequest(url, dataObject, callback) {


  var data = null
  var config = null
  if (dataObject.method == "update" || dataObject.method == "create") {
    // console.log("method", dataObject.void ? "delete" : (dataObject.id ? "update" : "create"));
    data = new FormData();
    data.append("erp_employee_code", dataObject.erp_employee_code);
    data.append("method", dataObject.method);
    data.append("id", dataObject.id ? dataObject.id : "");
    data.append("void", dataObject.void ? dataObject.void : 0);
    dataObject.items.forEach((item, index) => {
      data.append("items[" + index + "][ItemType]", item.ItemType ? item.ItemType : "");
      data.append("items[" + index + "][ItemId]", item.ItemId ? item.ItemId : "");
      data.append("items[" + index + "][Qty]", item.Qty ? item.Qty : "");
      data.append("items[" + index + "][note]", item.note ? item.note : "");
    });
    // console.log("in");
    config = {
      method: 'post',
      url: url,//'http://109.224.7.69:777/my_inventory.php',
      headers: {
        'Authorization': token,
        ...data.getHeaders()
      },
      data: data
    };



  }
  else if (dataObject.method == "reports_info") {
    data = new FormData();
    dataObject.submission_ids.forEach((item, index) => {
      data.append("submission_ids[" + index + "]", item ? item : 0);
    });
    config = {
      method: 'post',
      url: url,//'http://109.224.7.69:777/my_inventory.php',
      headers: {
        'Authorization': token,
        ...data.getHeaders()
      },
      data: dataObject
    };
  }
  else {

    data = new FormData();
    Object.keys(dataObject).forEach(dataObjectKey => {
      if (dataObject.hasOwnProperty(dataObjectKey) && dataObject[dataObjectKey] !== undefined) {
        data.append(dataObjectKey, dataObject[dataObjectKey]);
      }
    });
    config = {
      method: 'post',
      url: url,//'http://109.224.7.69:777/my_inventory.php',
      headers: {
        'Authorization': token,
        ...data.getHeaders()
      },
      data: data
    };
  }


  // console.log(config);
  axios(config)

    .then(function (response) {

      if (response.data.hasOwnProperty('error')) {
        callback({ status: false, data: response.data })
      }
      else callback({ status: true, data: response.data })
    })
    .catch(function (error) {

      // console.log("error catche")
      errorLogs.error(error)
      callback(error);
      return
    })
    .finally(function () {

      // console.log("in final");

    });
}

const getSNDeviceTypeService = (serialNumber, callback) => {

  
  var url = erpHost + "/serial_number_device_type.php"

  makeRequest(url, { serial_number: serialNumber }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}
var getErpEmployeeCode = (erp_employee_code, callback) => {

  var url = erpHost + "/my_inventory.php"

  makeRequest(url, { erp_employee_code: erp_employee_code }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

var getMyAccessories = (erp_employee_code, callback) => {

  var url = erpHost + "/my_accessory.php"

  makeRequest(url, { erp_employee_code: erp_employee_code }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

var getMySimcards = (erp_employee_code, callback) => {

  var url = erpHost + "/my_simcard.php"

  makeRequest(url, { erp_employee_code: erp_employee_code }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}


var getMyTransferRequests = (erp_employee_code, filters, callback) => {

  var url = erpHost + "/my_transfer_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, method: "get_requests", ...filters }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

var getTransferRequestsMasters = (erp_employee_code, callback) => {

  var url = erpHost + "/my_transfer_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, method: "get_masters" }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}


var createTransferRequest = (erp_employee_code, object, callback) => {

  var url = erpHost + "/my_transfer_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, ...object, method: "create" }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}
var updateTransferRequest = (erp_employee_code, object, callback) => {

  var url = erpHost + "/my_transfer_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, ...object, method: "update" }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}


var getMyTransferRequestItems = (erp_employee_code, request_id, callback) => {

  var url = erpHost + "/my_transfer_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, method: "get_request_items", request_id: request_id ? request_id : 0 }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

var getInventoryRequestsMasters = (erp_employee_code, callback) => {

  var url = erpHost + "/my_inventory_requests.php"

  makeRequest(url, { erp_employee_code: erp_employee_code, method: "get_masters" }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

var getReportsInfo = (submissionIds, callback) => {

  var url = erpHost + "/reports_info.php"

  makeRequest(url, { submission_ids: submissionIds, method: "reports_info" }, res => {


    if (res.status) callback(res.data)
    else callback(res.data)
  })
}
var getReportsInfoByDate = (dateFrom, dateTo, callback) => {

  var url = erpHost + "/reports_info.php"

  makeRequest(url, { date_from: dateFrom, date_to: dateTo }, res => {

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}
var getReportsInfoByDatePagination = (dateFrom, dateTo, pageNumber, pageSize,report_type, callback) => {

  var url = erpHost + "/reports_info.php"

  makeRequest(url, { date_from: dateFrom, date_to: dateTo, page_number: pageNumber, page_size: pageSize,report_type:report_type?report_type:'' }, res => {

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

function makeRequestCopySubmissionToERP(url, dataObject, callback) {
  data = new FormData();
  // console.log(dataObject);
  Object.keys(dataObject).forEach(dataObjectKey => {
    if(dataObject[dataObjectKey])
    data.append(dataObjectKey, dataObject[dataObjectKey]);
  });
  config = {
    method: 'post',
    url: erpHost + url,//'http://109.224.7.69:777/my_inventory.php',
    headers: {
      'Authorization': token,
      ...data.getHeaders()
    },
    data: data
  };

  axios(config)

    .then(function (response) {

      if (response.data.hasOwnProperty('error')) {
        callback({ status: false, data: response.data })
      }
      else callback({ status: true, data: response.data })
    })
    .catch(function (error) {

      // console.log("error catche")
      callback(error);
      errorLogs.error("copy submission to erp", ":", error)
    })
    .finally(function () {

      // console.log("in final");

    });
}

var getCustomersPagination = (lastUpdatedDate, pageNumber, pageSize, callback) => {

  var url = erpHost + "/customers.php"

  let params = {
    page_number: pageNumber, page_size: pageSize
  }
  if(lastUpdatedDate)
  {
    params = {
      ...params,
      last_updated_date:lastUpdatedDate
    }
  }

  makeRequest(url, params, res => {

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}


var getAmanaatByCusId = (erp_customer_id, callback) => {

  var url = erpHost + "/amanaat_by_cus_id.php"

  makeRequest(url, { CusId:erp_customer_id }, res => {
    // console.log("in make request");

    if (res.status) callback(res.data)
    else callback(res.data)
  })
}

module.exports = {
  getErpEmployeeCode,
  makeRequest,
  getMyAccessories,
  getMySimcards,
  makeRequestWithFile,
  getMyTransferRequests,
  getTransferRequestsMasters,
  createTransferRequest,
  updateTransferRequest,
  getMyTransferRequestItems,
  getInventoryRequestsMasters,
  getReportsInfo,
  getReportsInfoByDate,
  getReportsInfoByDatePagination,
  makeRequestCopySubmissionToERP,
  getCustomersPagination,
  getAmanaatByCusId,
  getSNDeviceTypeService
}