export type Key = string | number | symbol;
export type Obj<T = unknown> = { [k: Key]: T };

export type Mappable<T = unknown> =Partial<Obj<T> | readonly T[]>;
export type NonEmptyMappable<T = unknown> = Partial<Obj<T> | readonly [T, ...T[]]>;