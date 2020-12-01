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

type displaytype = "none" | "new" | "edit" | "view" | "delete";
type displayelement = "none" | "character" | "campaign" | "add_connection" | "remove_connection";

type requests = "register" | "login" | "auth" | "logout" | "add_connection" | "remove_connection"
	| "new_char" | "list_char" | "edit_char" | "delete_char"
	| "new_camp" | "list_camp" | "edit_camp" | "delete_camp" | "get_camp";

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
	data: any;
	type: displaytype;
	close: () => void;
	getLists: () => void;
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface blockprops {
	datakey: string;
	type: string;
	data: any;
}

interface tableprops {
	datakey: string;
	type: string;
	data: any;
}

interface rowDataset {
	data: any;
	datetime: string;
	type: "character" | "campaign";
}

interface listrowprops {
	rowData: rowDataset;
	setDisplay: (value: React.SetStateAction<[displayelement, displaytype, string, any]>) => void;
}

interface miniprops {
	label: string;
	rType: "Add" | "Remove";
	char_key?: string;
	camp_key?: string;
	close: () => void;
	getLists: () => void;
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface basicprops {
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface sharedprops {
	showLogout: boolean;
	userRequest: (path: string, requestType: requests, data?: any) => Promise<any[] | boolean>;
}

interface selectprops {
	row: blockrow;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>, rowName: string) => void;
	type: string;
	value: string;
}

interface notificationprops {
	type: "error" | "message" | "success";
	message: string;
}

interface dividerprops {
	children?: string;
}
