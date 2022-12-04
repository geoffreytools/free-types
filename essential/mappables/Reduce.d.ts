import { Type, apply, Checked } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
import { NonEmptyMappable } from './common';
import { IsEmpty } from './IsEmpty';
import { Object2Tuple } from './Object2Tuple';
export { ReduceTuple, Reduce, $Reduce, };
declare type Reduce<T extends NonEmptyMappable<ValidInput<$T>> & ProceduralCheck, $T extends Type<2>, ProceduralCheck = IsEmpty<T> extends false ? unknown : NonEmpty> = _Reduce<T, $T>[T extends unknown[] ? 'tuple' : 'object'];
declare type ValidInput<$T extends Type> = $T['constraints'][0] & $T['constraints'][1];
declare type NonEmpty = {
    [field]: never;
};
declare const field: unique symbol;
interface _Reduce<T extends NonEmptyMappable, $T extends Type<2>> {
    tuple: ReduceTuple<T & unknown[], $T>;
    object: ReduceTuple<Object2Tuple<T> & unknown[], $T>;
}
declare type ReduceTuple<T extends unknown[], $T extends Type<2>, Acc = T[0], I extends number = 1> = T['length'] extends 0 ? never : I extends T['length'] ? Acc : ReduceTuple<T, $T, apply<$T, [Acc, T[I]]>, Next<I>>;
interface $Reduce<$T extends Type<2>> extends Type {
    type: this['arguments'] extends this['constraints'] ? this['result'] extends $T['type'] ? this['result'] : $T['type'] : $T['type'];
    result: _Reduce<Checked<0, this>, $T>[this[0] extends unknown[] ? 'tuple' : 'object'];
    constraints: [NonEmptyMappable<ValidInput<$T>>];
}
