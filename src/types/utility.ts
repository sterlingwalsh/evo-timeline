export type Require<T extends object, Key extends keyof T> = Omit<T, Key> & Required<Pick<T, Key>>;
