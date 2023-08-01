import { Type, Checked, apply } from 'free-types-core';
import { NonEmptyMappable } from './common';
import { IsEmpty } from './IsEmpty';
import { Reduce as ReduceTuple } from '../Tuple/Reduce';
import { NonEmptyTuple } from '../Tuple/common';
import { LastUnionMember } from '../utils';

export { Reduce, $Reduce }

type Reduce<
    T extends NonEmptyMappable<ValidInput<$T>> & ProceduralCheck,
    $T extends Type<2>,
    ProceduralCheck = IsEmpty<T> extends false ? unknown : NonEmpty
> = _Reduce<T, $T>

type _Reduce<T extends {}, $T extends Type<2>> =
    T extends NonEmptyTuple
    ? ReduceTuple<T, $T>
    : ReduceObject<T, $T>

type ReduceObject<T extends {}, $T extends Type<2>> =
    _ReduceObject<T, $T, keyof T>

type _ReduceObject<
    T,
    $Reducer extends Type<2>,
    Keys extends keyof T,
    Last extends keyof T = LastUnionMember<Keys> & keyof T,
    Acc = never,
    Remaining extends keyof T = Exclude<Keys, Last>,
    R = [Acc] extends [never] ? T[Last] : apply<$Reducer, [Acc, T[Last]]>
> = [Remaining] extends [never]
    ? R
    : _ReduceObject<
        T,
        $Reducer,
        Remaining,
        LastUnionMember<Remaining> & keyof T,
        R
    >;

type ValidInput<$T extends Type> = $T['constraints'][0] & $T['constraints'][1];

type NonEmpty = { [field]: never }
declare const field: unique symbol;

interface $Reduce<$T extends Type<2>> extends Type {
    type: this['arguments'] extends this['constraints']
        ? this['result'] extends $T['type']
            ? this['result'] : $T['type']
        : $T['type']
    result: _Reduce<Checked<0, this>, $T>
    constraints: [NonEmptyMappable<ValidInput<$T>>]
}