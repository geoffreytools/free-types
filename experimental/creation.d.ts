import { ArrayKeys, Next } from "free-types-core/dist/utils";
export { IndexOf, SelectValue, NormalizeArgs };
declare type IndexOf<T, Ts extends unknown[], I extends number = 0> = [
    T
] extends [never] ? never : I extends Ts['length'] ? never : [T] extends [Ts[I]] ? I : IndexOf<T, Ts, Next<I>>;
declare type SelectValue<T, This extends unknown[], I extends number> = [
    I
] extends [never] ? T : This[I];
declare type NormalizeArgs<T extends unknown[]> = {
    [K in keyof T]: K extends ArrayKeys ? T[K] : T[K] extends unknown[] ? NormalizeArgs<T[K]> : T[K] extends number ? `${T[K]}` : T[K];
};
