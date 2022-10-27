export interface LoggedDetailsType{
 isUserLogged: boolean,
 accessToken: string,
 tokenType: string
}

export interface isLoggedProps { 
	isLogged:LoggedDetailsType
}

interface UserAuthentication {
    type:"USER_AUTHENTICATED",
    payload:LoggedDetailsType,
}

interface ResetUser{
    type:"RESET_USER",
}


export type Action = UserAuthentication | ResetUser

