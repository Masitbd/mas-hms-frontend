interface Profile {
  _id: string;
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  email: string;
  phone: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Permissions {
  _id: string;
  uuid: string;
  permissions: number[];
  __v: number;
}

interface IAUth {
  _id: string;
  uuid: string;
  role: string;
  needsPasswordChange: boolean;
  permissions: Permissions;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profile: Profile;
}

interface IMode {
  NEW: "new";
  EDIT: "edit";
  VIEW: "view";
  CHANGE_PASSWROD: "change_password";
}
