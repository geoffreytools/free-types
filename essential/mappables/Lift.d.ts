import { Type, $partial, $apply, ToTuple } from 'free-types-core/dist/';
import { Next, ArrayKeys } from 'free-types-core/dist/utils';
import { LastUnionMember } from '../utils';
import { _Ap } from './Ap';
import { IterativeTupleMap } from './IterativeMap';
import { Mappable } from './common';
export { Lift, $Lift };
interface $Lift<$T extends Type> extends Type {
    type: this['arguments'] extends Mappable<unknown>[] ? _Lift<$T, this['arguments']> : Mappable<$T['type']>;
    constraints: ToTuple<Check<$T['constraints']> & unknown[]>;
}
declare type Lift<$T extends Type, T extends Check<$T['constraints']>> = _Lift<$T, T>;
declare type _Lift<$T extends Type, T extends {
    [k: number]: unknown;
}> = __Lift<IterativeTupleMap<T[0], $partial<$T>>, T>;
declare type __Lift<$Step, T extends {
    [k: number]: unknown;
}, I extends number = 1> = $Step extends Mappable<Type> ? ($Step[AnyKeyOf<$Step>] extends Type<0> ? IterativeTupleMap<$Step, $apply<[]>> : __Lift<_Ap<$Step, T[I]>, T, Next<I>>) : $Step;
declare type AnyKeyOf<T, Keys = keyof T> = Keys & LastUnionMember<Exclude<Keys, ArrayKeys>>;
declare type Check<C extends unknown[]> = {
    [K in keyof C]: K extends ArrayKeys ? C[K] : Mappable<C[K]>;
};
