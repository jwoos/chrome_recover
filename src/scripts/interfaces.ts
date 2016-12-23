export interface InterfaceEventOptions {
	capture?: boolean;
	once?: boolean;
	usePassive?: boolean;
}

export interface InterfaceEventListener {
	eventType: string;
	fn: any; // FIXME how to type functions?
	options: InterfaceEventOptions;
}

export interface InterfaceVisibleFnConfig {
	[propName: string]: Array<string>;
}

export interface InterfaceRivetsConfig {
	executeFunctions?: boolean;
	handler?: any;
	iterationAlias?: any;
	prefix?: string;
	preloadData?: boolean;
	rootInterface?: string;
	templateDelimiters?: string;
}
