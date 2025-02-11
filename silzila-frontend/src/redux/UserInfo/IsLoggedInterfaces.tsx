export interface LoggedDetailsType {
    isUserLogged: boolean;
    accessToken: string;
    tokenType: string;
    email: string ;
    firstName: string ;
    lastName: string ;
    avatar: string ;
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
  
  export type Action = UserAuthentication | ResetUser;
  