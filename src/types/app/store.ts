export type IAction<Type, Payload = undefined> = Payload extends undefined
	? { type: Type }
	: { type: Type; payload: Payload };
