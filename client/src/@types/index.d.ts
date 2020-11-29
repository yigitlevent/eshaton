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

type displaytype = "none" | "new" | "edit" | "view";
type displayelement = "none" | "character" | "campaign" | "add_connection" | "remove_connection";

type requests = "register" | "login" | "auth" | "logout" | "add_connection" | "remove_connection"
	//	CH CA		 CH CA			X X			X X				X X
	| "new_char" | "list_char" | "get_char" | "edit_char" | "remove_char"
	| "new_camp" | "list_camp" | "get_camp" | "edit_camp" | "remove_camp";

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
	userRequest: (path: string, requestType: requests, data?: registrationform | loginform) => Promise<any[] | boolean>;
}

interface sheetprops {
	close: () => void;
	type: "none" | "new" | "edit" | "view";
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface blockprops {
	datakey: string;
}

interface listrowprops {
	row: any;
	dt: any;
	type: "Add" | "Remove";
	setDisplay: (value: React.SetStateAction<displayelement>) => void;
	setLastKey: (value: React.SetStateAction<string>) => void;
	setLastData: (value: any) => void;
}

interface miniprops {
	label: string;
	rType: "Add" | "Remove";
	char_key?: string;
	camp_key?: string;
	close: () => void;
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface basicprops {
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
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
