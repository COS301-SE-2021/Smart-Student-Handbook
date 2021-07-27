export interface Account {
  uid: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  displayName: string;
  message?: string;
}
