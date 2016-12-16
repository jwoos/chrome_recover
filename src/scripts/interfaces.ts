export interface InterfaceEventOptions {
	capture?: boolean;
	usePassive?: boolean;
	once?: boolean;
}

export interface InterfaceEventListener {
	fn: any; // how to type functions?
	eventType: string;
	options: InterfaceEventOptions;
}

export interface InterfaceVisibleFnConfig {
	[propName: string]: Array<string>;
}
