type dispSet<T> = React.Dispatch<React.SetStateAction<T>>;

interface size {
	width: number;
	height: number;
}

interface position {
	left?: number;
	top?: number;
	bottom?: number;
	right?: number;
}

interface coordinate {
	x: number;
	y: number;
}

type requests = "register" | "login" | "auth";
type sheettype = "none" | "new" | "edit" | "view";
type campaigntype = "none" | "new" | "edit" | "view";

interface registrationform {
	r_username: string;
	r_email: string;
	r_password: string;
	r_passwordrepeat: string;
}

interface loginform {
	l_username: string;
	l_password: string;
}

interface entranceprops {
	setIsLogin: (b: boolean) => void;
	userRequest: (path: string, requestType: requests, data?: registrationform | loginform) => void;
}

interface charactersheetprops {

}
