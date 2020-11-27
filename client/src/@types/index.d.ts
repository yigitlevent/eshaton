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

type requests = "register" | "login" | "auth" | "add_char" | "list_char" | "get_char" | "add_camp" | "list_camp" | "get_camp";
type sheettype = "none" | "new" | "edit" | "view";
type campaigntype = "none" | "new" | "edit" | "view";

interface blockrow {
	name: string;
	type: "empty" | "normal" | "title" | "title-major" | "input" | "select" | "condition" | "condition-title" | "logo";
	checkboxes: 0 | 3 | 6 | 12 | 24;
	placeholder?: boolean;
	selectdata?: string[];
}

interface tabledata {
	rows: number;
	columns: string[];
}

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
	sheet: "none" | "new" | "edit" | "view";
	userRequest: (path: string, requestType: requests, data?: any) => void;
}

interface blockprops {
	datakey: string;
}

interface selectprops {
	row: blockrow;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>, rowName: string) => void;
}

interface tableprops {
	datakey: string;
}

interface notificationprops {
	type: "error" | "message" | "success";
	message: string;
}

interface dividerprops {
	children?: string;
}
