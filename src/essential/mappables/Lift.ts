import { Type, _Type, $partial, $apply, AppliedArguments, CreateType } from 'core';
import { Next, ArrayKeys, LastUnionMember } from 'utils';
import { _Ap } from './Ap';
import { IterativeTupleMap } from './IterativeMap';
import { Mappable } from './common';

export { Lift, $Lift }

interface $Lift<$T extends _Type> extends CreateType<{ type: unknown }, { constraints: Check<$T['constraints']>, names: {} }> {
    type: AppliedArguments<this> extends Mappable<unknown>[]
        ? _Lift<$T, AppliedArguments<this>>
        : Mappable<$T['type']>
}

type Lift<$T extends _Type, T extends Check<$T['constraints']>> =
    _Lift<$T, T>

type _Lift<$T extends _Type, T extends { [k: number]: unknown }> =
    __Lift<IterativeTupleMap<T[0], $partial<$T>>, T>

type __Lift<$Step, T extends { [k: number]: unknown }, I extends number = 1> =
    $Step extends Mappable<Type> ? (
        $Step[AnyKeyOf<$Step>] extends Type<0>
        ? IterativeTupleMap<$Step, $apply<[]>>
        : __Lift<_Ap<$Step, T[I]>, T, Next<I>>
    ) : $Step

type AnyKeyOf<T, Keys = keyof T> =
    Keys & LastUnionMember<Exclude<Keys, ArrayKeys>>

type Check<C extends unknown[]> = {
    [K in keyof C]: K extends ArrayKeys ? C[K] : Mappable<C[K]>
}
