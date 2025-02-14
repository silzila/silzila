export interface LoggedDetailsType {
    isUserLogged: boolean;
    accessToken: string;
    tokenType: string;
    email?: string ;
    firstName?: string ;
    lastName?: string ;
    avatar?: string ;
  }
  
  export interface isLoggedProps {
    isLogged: LoggedDetailsType;
  }
  
  interface UserAuthentication {
    type: "USER_AUTHENTICATED";
    payload: LoggedDetailsType;
  }
  
  interface ResetUser {
    type: "RESET_USER";
  }
  interface CustomDefault {
    type: "CUSTOM_DEFAULT";
  }
  
  export type Action = UserAuthentication | ResetUser | CustomDefault;
  