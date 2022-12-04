import { Mappable } from './common';
import { Type, apply, partial } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
export declare type Ap<$Ts extends Mappable<Type>, Ts extends Mappable<unknown>> = _Ap<$Ts, Ts>;
export declare type _Ap<$Ts, Ts> = [
    $Ts,
    Ts
] extends unknown[][] ? TupleAp<[$Ts, Ts]> : ObjAp<$Ts, Ts>;
declare type ObjAp<$Ts, Ts> = {
    [K in keyof $Ts & keyof Ts]: Exec<$Ts[K], Ts[K]>;
};
declare type TupleAp<T extends unknown[][]> = _TupleAp<T[0], T[1], T[0]['length'] | T[1]['length']>;
declare type _TupleAp<$Ts extends unknown[], Ts extends unknown[], End, I extends number = 0, R extends unknown[] = []> = I extends End ? R : _TupleAp<$Ts, Ts, End, Next<I>, [...R, Exec<$Ts[I], Ts[I]>]>;
declare type Exec<$T, T> = $T extends Type<1> ? apply<$T, [T]> : $T extends Type ? partial<$T, [T]> : never;
export {};
