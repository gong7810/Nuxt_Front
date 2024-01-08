import { defineStore } from "pinia";
import {
  addVehicleList,
  addVehicleLogbook,
  deleteVehicleList,
  delteVehicleLogbook,
  getDeptList,
  getEmpList,
  getVehicleDetailList,
  getVehicleList,
  getVehicleLogbook,
  updateVehicleDetailList,
  updateVehicleList,
} from "@/api/account/vehicle";

export const vehicleStore = defineStore("vehicleStore", {
  state: () => ({
    selectedRow: [],
    deptList: [],
    empList: [],
    vehicleList: [],
    vehicleDetailList: [],
    vehicleLogbook: [],
  }),
  actions: {
    // 부서 조회
    async GET_DEPT_LIST() {
      try {
        const response = await getDeptList();

        this.deptList = response.data.deptList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 사원 조회
    async GET_EMP_LIST() {
      try {
        const response = await getEmpList();

        this.empList = response.data.empList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 조회
    async GET_VEHICLE_LIST() {
      try {
        const response = await getVehicleList();

        this.vehicleList = response.data.vehicleList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 추가
    async ADD_VEHICLE_LIST(addVehicleInfo: any) {
      try {
        await addVehicleList(addVehicleInfo);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 수정
    async UPDATE_VEHICLE_LIST(updateVehicleInfo: any) {
      try {
        await updateVehicleList(updateVehicleInfo);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 삭제
    async DELETE_VEHICLE_LIST(vehicleCode: any) {
      try {
        await deleteVehicleList(vehicleCode);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 상세정보 조회
    async GET_DETAIL_VEHICLE_LIST() {
      try {
        const response = await getVehicleDetailList();

        this.vehicleDetailList = response.data.vehicleDetailList;

        return response.data.vehicleDetailList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 상세정보 수정
    async UPDATE_VEHICLE_DETAIL_LIST(updateVehicleDetailInfo: any) {
      try {
        await updateVehicleDetailList(updateVehicleDetailInfo);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 운행기록부 조회
    async GET_VEHICLE_LOGBOOK_LIST(vehicleCode: string) {
      try {
        const response = await getVehicleLogbook(vehicleCode);

        this.vehicleLogbook = response.data.vehicleLogbook;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 운행기록부 추가
    async ADD_VEHICLE_LOGBOOK_LIST(addVehicleLogbookInfo: any) {
      try {
        await addVehicleLogbook(addVehicleLogbookInfo);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 업무용승용차 운행기록부 삭제
    async DELETE_VEHICLE_LOGBOOK_LIST(vehicleCode: string, useDate: string) {
      try {
        await delteVehicleLogbook(vehicleCode, useDate);
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
});
