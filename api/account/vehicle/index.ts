import axios from "axios";

const BASE_URL = "http://localhost:8282/acc";

// 부서 조회
function getDeptList() {
  return axios.get(`http://localhost:8282/hr/base/getDeptList`);
}

// 사원 조회
function getEmpList() {
  return axios.get(`http://localhost:8282/hr/affair/getEmpList`);
}

// 업무용승용차 조회
function getVehicleList() {
  return axios.get(`${BASE_URL}/vehicle/getVehicleList`);
}

// 업무용승용차 추가
function addVehicleList(addVehicleInfo: any) {
  return axios.post(`${BASE_URL}/vehicle/addVehicleList`, addVehicleInfo);
}

// 업무용승용차 수정
function updateVehicleList(updateVehicleInfo: any) {
  return axios.put(`${BASE_URL}/vehicle/updateVehicleList`, updateVehicleInfo);
}

// 업무용승용차 삭제
function deleteVehicleList(vehicleCode: string) {
  return axios.delete(`${BASE_URL}/vehicle/deleteVehicleList`, {
    params: {
      vehicleCode,
    },
  });
}

// 업무용승용차 상세정보 조회
function getVehicleDetailList() {
  return axios.get(`${BASE_URL}/vehicle/getVehicleDetailList`);
}

// 업무용승용차 상세정보 수정
function updateVehicleDetailList(updateVehicleDetailInfo: any) {
  return axios.put(
    `${BASE_URL}/vehicle/updateVehicleDetailList`,
    updateVehicleDetailInfo
  );
}

// 업무용승용차 운행기록부 조회
function getVehicleLogbook(vehicleCode: string) {
  return axios.get(`${BASE_URL}/vehicle/getVehicleLogbook`, {
    params: {
      vehicleCode,
    },
  });
}

// 업무용승용차 운행기록부 추가
function addVehicleLogbook(addVehicleDetailInfo: any) {
  return axios.post(
    `${BASE_URL}/vehicle/addVehicleLogbook`,
    addVehicleDetailInfo
  );
}

// 업무용승용차 운행기록부 삭제
function delteVehicleLogbook(vehicleCode: string, useDate: string) {
  return axios.delete(`${BASE_URL}/vehicle/deleteVehicleLogbook`, {
    params: {
      vehicleCode,
      useDate,
    },
  });
}

export {
  getDeptList,
  getEmpList,
  getVehicleList,
  addVehicleList,
  updateVehicleList,
  deleteVehicleList,
  getVehicleDetailList,
  updateVehicleDetailList,
  getVehicleLogbook,
  addVehicleLogbook,
  delteVehicleLogbook,
};
