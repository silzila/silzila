import { LoggedDetailsType } from "../../redux/UserInfo/IsLoggedInterfaces";

export interface LogginDetails{
    email:string,
	emailError: string,
	password:string,
	passwordError:string,
}

export interface DispatchProps {
  userAuthentication: (payload:LoggedDetailsType) => void;
}


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ signup interface @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export interface  SignUpDetails {
    name: string,
	nameError: string,

	email: string,
	emailError: string,

	password: string,
	passwordError:string,

	password2: string,
	password2Error: string,
}