import { Type, Checked, apply } from 'free-types-core';
import { _NonEmptyMappable, NonEmptyMappable, Obj } from './common';
import { Reduce as ReduceTuple } from '../Tuple/Reduce';
import { NonEmptyTuple } from '../Tuple/common';
import { LastUnionMember } from '../utils';

export { Reduce, $Reduce }

type Reduce<
    T extends Check,
    $T extends Type<2>,
    Check extends {} = _NonEmptyMappable<T, ValidInput<$T>>
> = _Reduce<T, $T>

type _Reduce<T extends {}, $T extends Type<2>> =
    T extends NonEmptyTuple
    ? ReduceTuple<T, $T>
    : [] extends T ? never
    : ReduceObject<T, $T>

type ReduceObject<
    T extends Obj,
    $Reducer extends Type<2>,
    Keys extends PropertyKey = keyof T,
    Acc = never,
    Last extends PropertyKey = LastUnionMember<Keys> & PropertyKey,
    Remaining extends PropertyKey = Exclude<Keys, Last>,
    R = [Acc] extends [never] ? T[Last] : apply<$Reducer, [Acc, T[Last]]>
> = [Remaining] extends [never] ? R
    : ReduceObject<T, $Reducer, Remaining, R>;

type ValidInput<$T extends Type> = $T['constraints'][0] & $T['constraints'][1];

interface $Reduce<$T extends Type<2>> extends Type {
    type: this['arguments'] extends this['constraints']
        ? this['result'] extends $T['type']
            ? this['result'] : $T['type']
        : $T['type']
    result: _Reduce<Checked<0, this>, $T>
    constraints: [NonEmptyMappable<ValidInput<$T>>]
}