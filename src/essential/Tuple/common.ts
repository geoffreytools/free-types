export type Tuple<T = unknown> = readonly [] | NonEmptyTuple<T>;

export type NonEmptyTuple<T = unknown> = readonly [T, ...(readonly T[])];

export type PreserveReadonly<T, R> = T extends unknown[] ? R : Readonly<R>;