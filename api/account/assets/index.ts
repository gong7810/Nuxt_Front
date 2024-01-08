import axios from "axios";

const BASE_URL = "http://localhost:8282/acc";

// 고정자산 코드조회
function getFixedAssetsCodeList() {
  return axios.get(`${BASE_URL}/assets/getFixedAssetCodeList`);
}

// 감가상각현황 전체조회
function getDepreciationList() {
  return axios.get(`${BASE_URL}/assets/getDepreciationList`);
}

// 감가상각현황 조건조회
function selectedDepreciationList({ accountCode }: any) {
  return axios.get(`${BASE_URL}/assets/selectedDepreciationList`, {
    params: { accountCode },
  });
}

// 고정자산관리대장 전체조회
function getfixedAssetLedgerList() {
  return axios.get(`${BASE_URL}/assets/getFixedAssetLedgerList`);
}

// 고정자산 조건조회
function searchFixedAssetsCodeList({ fixedAssetsCode, fixedAssetsName }: any) {
  return axios.get(`${BASE_URL}/assets/searchFixedAssetList`, {
    params: {
      fixedAssetsCode,
      fixedAssetsName,
    },
  });
}

// 고정자산 상세조회
function searchFixedAssetsDetailList({ assetCode }: any) {
  return axios.get(`${BASE_URL}/assets/searchFixedAssetDetailList`, {
    params: { assetCode },
  });
}

// 고정자산 추가
function addFixedAssetsCodeList({ data }: any) {
  return axios.post(`${BASE_URL}/assets/addFixedAssetList`, data);
}

// 고정자산 수정
function updateFixedAssetsCodeList({ data }: any) {
  return axios.post(`${BASE_URL}/assets/addFixedAssetList`, data);
}

// 고정자산 삭제
function deleteFixedAssetsCodeList({ assetsCode }: any) {
  return axios.delete(`${BASE_URL}/assets/deleteFixedAssetList`, {
    params: { assetCode: assetsCode.value },
  });
}

export {
  getFixedAssetsCodeList,
  getDepreciationList,
  selectedDepreciationList,
  getfixedAssetLedgerList,
  searchFixedAssetsCodeList,
  searchFixedAssetsDetailList,
  addFixedAssetsCodeList,
  updateFixedAssetsCodeList,
  deleteFixedAssetsCodeList,
};
