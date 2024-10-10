import { useResetPasswordMutation } from "@/redux/api/authentication/authenticationSlice";
import swal from "sweetalert";

export class PasswordValidator {
  password1: string;
  password2: string;

  constructor(password1: string, password2: string) {
    this.password1 = password1;
    this.password2 = password2;
  }

  validate() {
    if (this.password1?.length == 0 || this.password2?.length == 0)
      return false;
    return this.password1 === this.password2;
  }
}
