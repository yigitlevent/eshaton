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
type displayelement = "none" | "character" | "campaign" | "add_to_campaign" | "remove_from_campaign" | "add_to_character" | "remove_from_character";
type requests = "register" | "login" | "auth" | "add_char" | "list_char" | "add_camp" | "list_camp"
	| "get_char" | "get_camp" | "edit_char" | "edit_camp" | "remove_char" | "remove_camp"
	| "add_char_to" | "remove_char_from";

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

interface sheetprops {
	close: () => void;
	type: "none" | "new" | "edit" | "view";
	userRequest: (path: string, requestType: requests, data?: any) => void;
}

interface blockprops {
	datakey: string;
}

interface listrowprops {
	row: any;
	dt: any;
	type: "character" | "campaign";
	setDisplay: (value: React.SetStateAction<displayelement>) => void;
	setLastKey: (value: React.SetStateAction<string>) => void;
	setLastData: (value: any) => void;
}

interface miniprops {
	title: string;
	label?: string;
	char_key?: string;
	camp_key?: string;
	rType: "add" | "remove";
	close: () => void;
	userRequest: (path: string, requestType: requests, data?: any) => void;
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
