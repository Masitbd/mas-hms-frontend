export type ICondition = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
export type ISpecimen = {
  _id?: string;
  label: string;
  value: string;
  description: string;
};
export type IVacuumTube = {
  _id?: string;
  label: string;
  value: string;
  price: number;
  description: string;
};
export type IDepartment = {
  _id?: string;
  label: string;
  value: string;
  commissionParcentage: number;
  fixedCommission: number;
  isCommissionFiexed: boolean;
  description?: string;
};

export type IDoctor = {
  _id?: string;
  name: string;
  fatherName: string;
  designation: string;
  phone: string;
  image: string;
  defaultImage?: string;
};
