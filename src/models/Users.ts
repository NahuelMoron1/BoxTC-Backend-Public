import { UserStatus } from "./enums/UserStatus";

export class User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  userID: string;
  status: UserStatus;
  profileImage?: string;

  constructor(
    id: string,
    fullName: string,
    email: string,
    password: string,
    phone: string,
    userID: string,
    status: UserStatus
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.userID = userID;
    this.status = status;
  }
}
