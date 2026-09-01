import { Type, _Type, Checked, apply, Expect, AppliedArguments } from 'core';
import { PickUnionMember } from 'utils';
import { _NonEmptyMappable, NonEmptyMappable, Obj } from './common';
import { Reduce as ReduceTuple } from 'essential/Tuple/Reduce';
import { NonEmptyTuple } from 'essential/Tuple/common';

export { Reduce, $Reduce }

type Reduce<
    T extends Check,
    $T extends Expect<Type<2>>,
    Check extends {} = _NonEmptyMappable<T, ValidInput<$T>>
> = _Reduce<T, $T>

type _Reduce<T extends {}, $T extends Type<2>> =
    T extends NonEmptyTuple
    ? ReduceTuple<T, $T>
    : [] extends T ? never
    : ReduceObject<T, $T>

type ReduceObject<
    T extends Obj,
    $Reducer extends _Type,
    Keys extends PropertyKey = keyof T,
    Acc = never,
    Last extends PropertyKey = PickUnionMember<Keys> & PropertyKey,
    Remaining extends PropertyKey = Exclude<Keys, Last>,
    R = [Acc] extends [never] ? T[Last] : apply<$Reducer, [Acc, T[Last]]>
> = [Remaining] extends [never] ? R
    : ReduceObject<T, $Reducer, Remaining, R>;

type ValidInput<$T extends Type> = $T['constraints'][0] & $T['constraints'][1];

interface $Reduce<$T extends Expect<Type<2>>> extends Type {
    type: AppliedArguments<this> extends this['constraints']
        ? this['result'] extends $T['type']
            ? this['result'] : $T['type']
        : $T['type']
    result: _Reduce<Checked<0, this>, $T>
    constraints: [NonEmptyMappable<ValidInput<$T>>]
}