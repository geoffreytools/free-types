export type Key = string | number | symbol;
export type Obj<T = unknown> = { [k: Key]: T };

export type Mappable<T = unknown> = Obj<T> | T[];
export type NonEmptyMappable<T = unknown> = Obj<T> | [T, ...T[]];
export type NonEmptyTuple<T = unknown> = [T, ...T[]];