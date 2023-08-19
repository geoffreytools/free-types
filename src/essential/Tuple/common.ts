export type Tuple<T = unknown> = readonly [] | NonEmptyTuple<T>;

export type Input<T = unknown> = readonly (T | undefined)[]
export type Output<T = unknown> = (T | undefined)[]

export type NonEmptyTuple<T = unknown> = readonly [T, ...(readonly T[])];

export type PreserveReadonly<T, R extends readonly unknown[]> = T extends unknown[] ? R : readonly [...R];

export type Fallback<
    T extends readonly unknown[],
    F,
    U = undefined extends T[number]? undefined : never
> = T extends unknown[] ? (F | U)[]
    : readonly (F | U)[]