// src/redux/features/serviceSlice.ts
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for our state
export interface ServiceItem {
  serviceCategory: string;
  serviceId: string;
  serviceName: string;
  servicedBy: string;
  amount: number;
  quantity: number;
  totalAmount: number;
  allocatedBed?: string | undefined;
  doctorId?: string | undefined;
}

export interface BillCategory {
  items: ServiceItem[];
  total: number;
}

export interface ServiceState {
  services: ServiceItem[];
  doctorBill: BillCategory;
  bedCabinsBill: BillCategory;
  hospitalBill: BillCategory;
  totalBill: number;
}

// Define types for our action payloads
interface AddServicePayload {
  serviceCategory: string;
  serviceId: string;
  serviceName: string;
  servicedBy?: string;
  amount: number;
  quantity?: number;
  allocatedBed?: string | undefined;
  doctorId?: string | undefined;
}

interface RemoveServicePayload {
  index: number;
  serviceCategory: string;
}

interface UpdateQuantityPayload {
  index: number;
  quantity: number;
}

// Backend format type
export interface BackendServiceFormat {
  serviceCategory: string;
  serviceId: string;
  allocatedBed?: string | undefined;
  doctorId?: string | undefined;
  servicedBy: string;
  amount: number;
  quantity: number;
}

const initialState: ServiceState = {
  services: [],
  doctorBill: {
    items: [],
    total: 0,
  },
  bedCabinsBill: {
    items: [],
    total: 0,
  },
  hospitalBill: {
    items: [],
    total: 0,
  },
  totalBill: 0,
};

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    // addService: (state, action: PayloadAction<AddServicePayload>) => {
    //   const {
    //     serviceCategory,
    //     serviceId,
    //     serviceName,
    //     servicedBy = "",
    //     amount,
    //     quantity = 1,
    //     allocatedBed,
    //     doctorId,
    //   } = action.payload;

    //   // Calculate the total amount for this service
    //   const totalAmount = amount * quantity;

    //   // Create the service object to add to the services array
    //   const newService: ServiceItem = {
    //     serviceCategory,
    //     serviceId,
    //     serviceName,
    //     servicedBy,
    //     amount,
    //     quantity,
    //     totalAmount,
    //     allocatedBed,
    //     doctorId,
    //   };

    //   // Add to the general services array
    //   state.services.push(newService);

    //   // Add to the specific bill category and update its total
    //   if (serviceCategory === "doctor's related") {
    //     state.doctorBill.items.push(newService);
    //     state.doctorBill.total += totalAmount;
    //   } else if (serviceCategory === "beds & cabins") {
    //     state.bedCabinsBill.items.push(newService);
    //     state.bedCabinsBill.total += totalAmount;
    //   } else {
    //     state.hospitalBill.items.push(newService);
    //     state.hospitalBill.total += totalAmount;
    //   }

    //   // Update the overall total bill
    //   state.totalBill += totalAmount;
    // },
    addService: (state, action: PayloadAction<AddServicePayload>) => {
      const {
        serviceCategory,
        serviceId,
        serviceName,
        servicedBy = "",
        amount,
        quantity = 1,
        allocatedBed,
        doctorId,
      } = action.payload;

      const totalAmount = amount * quantity;

      const newService: ServiceItem = {
        serviceCategory,
        serviceId,
        serviceName,
        servicedBy,
        amount,
        quantity,
        totalAmount,
        allocatedBed,
        doctorId,
      };

      // Only check for duplicates if NOT doctor's related
      if (serviceCategory !== "doctor's related") {
        const isDuplicate = state.services.some(
          (service) =>
            service.serviceId === serviceId &&
            service.serviceCategory === serviceCategory
        );

        if (isDuplicate) {
          return; // Skip duplicate
        }
      }

      // Push to services array
      state.services.push(newService);

      // Add to respective bill category
      if (serviceCategory === "doctor's related") {
        state.doctorBill.items.push(newService);
        state.doctorBill.total += totalAmount;
      } else if (serviceCategory === "beds & cabins") {
        state.bedCabinsBill.items.push(newService);
        state.bedCabinsBill.total += totalAmount;
      } else {
        state.hospitalBill.items.push(newService);
        state.hospitalBill.total += totalAmount;
      }

      // Update total bill
      state.totalBill += totalAmount;
    },

    removeService: (state, action: PayloadAction<RemoveServicePayload>) => {
      const { index, serviceCategory } = action.payload;

      // Find the service to remove
      const serviceToRemove = state.services[index];

      if (!serviceToRemove) return;

      // Remove from the general services array
      state.services = state.services.filter((_, i) => i !== index);

      // Update the specific bill category and its total
      if (serviceCategory === "doctor's related") {
        const itemIndex = state.doctorBill.items.findIndex(
          (item) =>
            item.serviceId === serviceToRemove.serviceId &&
            item.amount === serviceToRemove.amount &&
            item.doctorId === serviceToRemove.doctorId
        );

        if (itemIndex !== -1) {
          state.doctorBill.total -= serviceToRemove.totalAmount;
          state.doctorBill.items.splice(itemIndex, 1);
        }
      } else if (serviceCategory === "beds & cabins") {
        const itemIndex = state.bedCabinsBill.items.findIndex(
          (item) =>
            item.serviceId === serviceToRemove.serviceId &&
            item.amount === serviceToRemove.amount &&
            item.allocatedBed === serviceToRemove.allocatedBed
        );

        if (itemIndex !== -1) {
          state.bedCabinsBill.total -= serviceToRemove.totalAmount;
          state.bedCabinsBill.items.splice(itemIndex, 1);
        }
      } else {
        const itemIndex = state.hospitalBill.items.findIndex(
          (item) =>
            item.serviceId === serviceToRemove.serviceId &&
            item.amount === serviceToRemove.amount &&
            item.allocatedBed === serviceToRemove.allocatedBed
        );

        if (itemIndex !== -1) {
          state.hospitalBill.total -= serviceToRemove.totalAmount;
          state.hospitalBill.items.splice(itemIndex, 1);
        }
      }

      // Update the overall total bill
      state.totalBill -= serviceToRemove.totalAmount;
    },

    updateServiceQuantity: (
      state,
      action: PayloadAction<UpdateQuantityPayload>
    ) => {
      const { index, quantity } = action.payload;
      const service = state.services[index];

      if (!service) return;

      // Calculate the difference in amount
      const oldTotalAmount = service.totalAmount;
      const newTotalAmount = service.amount * quantity;
      const difference = newTotalAmount - oldTotalAmount;

      // Update the service
      service.quantity = quantity;
      service.totalAmount = newTotalAmount;

      // Update the specific bill category
      if (service.serviceCategory === "doctor's related") {
        const itemIndex = state.doctorBill.items.findIndex(
          (item) =>
            item.serviceId === service.serviceId &&
            item.amount === service.amount
        );

        if (itemIndex !== -1) {
          state.doctorBill.items[itemIndex].quantity = quantity;
          state.doctorBill.items[itemIndex].totalAmount = newTotalAmount;
          state.doctorBill.total += difference;
        }
      } else if (service.serviceCategory === "beds & cabins") {
        const itemIndex = state.bedCabinsBill.items.findIndex(
          (item) =>
            item.serviceId === service.serviceId &&
            item.amount === service.amount
        );

        if (itemIndex !== -1) {
          state.bedCabinsBill.items[itemIndex].quantity = quantity;
          state.bedCabinsBill.items[itemIndex].totalAmount = newTotalAmount;
          state.bedCabinsBill.total += difference;
        }
      } else {
        const itemIndex = state.hospitalBill.items.findIndex(
          (item) =>
            item.serviceId === service.serviceId &&
            item.amount === service.amount
        );

        if (itemIndex !== -1) {
          state.hospitalBill.items[itemIndex].quantity = quantity;
          state.hospitalBill.items[itemIndex].totalAmount = newTotalAmount;
          state.hospitalBill.total += difference;
        }
      }

      // Update the overall total bill
      state.totalBill += difference;
    },

    clearServices: (state) => {
      return initialState;
    },
  },
});

export const {
  addService,
  removeService,
  updateServiceQuantity,
  clearServices,
} = serviceSlice.actions;

// Selectors
export const selectServices = (state: RootState): ServiceItem[] =>
  state.service.services;
export const selectDoctorBill = (state: RootState): BillCategory =>
  state.service.doctorBill;
export const selectBedCabinsBill = (state: RootState): BillCategory =>
  state.service.bedCabinsBill;
export const selectHospitalBill = (state: RootState): BillCategory =>
  state.service.hospitalBill;
export const selectTotalBill = (state: RootState): number =>
  state.service.totalBill;
export const selectBackendFormat = (
  state: RootState
): BackendServiceFormat[] => {
  return state.service.services.map((service) => ({
    serviceCategory: service.serviceCategory,
    serviceId: service.serviceId,
    servicedBy: service.servicedBy,
    amount: service.amount,
    quantity: service.quantity,
    allocatedBed: service?.allocatedBed,
    doctorId: service?.doctorId,
  }));
};

export default serviceSlice.reducer;
