import { apply, Checked, A, Type, unwrap, free, partialRight } from "free-types-core";
import { IsAny } from "free-types-core/dist/utils";
import { $Arity } from "../essential/adapters/$Arity";
import { $Flip } from "../essential/adapters/$Flip";
import { $Before } from "../essential/composition/$Before";
import { Flow } from "../essential/composition/Flow";
import { IsUnion, Union2Tuple } from "../essential/utils";
import { Key } from "../essential/mappables/common";
import { $Lift } from "../essential/mappables/Lift";
import { $MapOver } from "../essential/mappables/MapOver";
import { $Join } from "../utility-types/strings/$Join";
import { Split } from "../utility-types/strings/$Split";
import { $Stitch } from "../utility-types/strings/$Stitch";
import { Showable } from "../utility-types/strings/common";
import { $Assert } from "../essential/composition/$Assert";
import { $Object2Tuple } from "../essential/mappables/Object2Tuple";
export { Show, $Show };
declare type Show<T> = _Show<T>;
declare type _Show<T, $T extends Type = IsAny<T> extends true ? Type<0, 'any'> : unknown extends T ? Type<0, 'unknown'> : boolean extends T ? Type<0, 'boolean'> : IsUnion<T> extends true ? $ShowUnion : [T] extends [never] ? Type<0, 'never'> : [T] extends [symbol] ? Type<0, 'symbol'> : [T] extends [Showable] ? $ShowShowable : T extends (...args: any[]) => unknown ? $ShowFunction : T extends Tuple ? $ShowTuple : T extends unknown[] ? $ShowArray : T extends {
    [k: Key]: unknown;
} ? $ShowObject : T extends {
    [k: Key]: any;
} ? $ShowClass : Type<0, '(unknown type)'>> = apply<$T, [T]>;
interface $Show extends Type<1> {
    type: Show<this[0]>;
}
declare type Tuple = [] | [unknown, ...unknown[]];
interface $ShowShowable extends Type<[Showable]> {
    type: number extends this[0] ? 'number' : string extends this[0] ? 'string' : this[0] extends bigint ? 'bigint' : `${this[0] & Showable}`;
}
interface $ShowClass extends Type<[{
    [k: Key]: any;
}]> {
    type: [this['Unwrapped']] extends [never] ? '(unknown custom type)' : `${this['URI']}<${this['Args']}>`;
    Unwrapped: unwrap<Checked<A, this>>;
    URI: this['Unwrapped']['URI'];
    Args: apply<$ShowList, [this['Unwrapped']['args']]>;
}
interface $ShowFunction extends Type {
    type: this[A] extends this['constraints'][A] ? `(${this['Input']}) => ${this['Output']}` : string;
    Output: undefined extends this['Return'] ? 'void' : Show<this['Return']>;
    Return: ReturnType<Checked<A, this>>;
    Input: this['Args'] extends [] ? '' : this['Args'] extends Tuple ? this['TupleArgs'] : this['ArrayArgs'];
    Args: Parameters<Checked<A, this>>;
    TupleArgs: apply<$ShowArgs, [this['Args'], Az]>;
    ArrayArgs: `...args: ${apply<$ShowArray, [this['Args']]>}`;
    constraints: [(...args: any[]) => unknown];
}
declare type Az = Split<'', 'abcdefghijklmnopkrstuvwxyz'>;
interface $ShowArray extends Type<[unknown[]]> {
    type: `${Show<A<this>[0]>}[]`;
}
declare type $ShowTuple = Flow<[$ShowList, $SquareWrap]>;
declare type $ShowList = Flow<[$MapOver<$Show>, $ComaJoin]>;
declare type $ShowObject = Flow<[$MapOver<$KeyValuePair>, $Object2Tuple, $ComaJoin, $CurlyWrap]>;
declare type $KeyValuePair = Flow<[
    $Flip<$Arity<2, $Before<free.Tuple, $Show>>>,
    $Join<': '>
]>;
declare type $ShowArgs = Flow<[
    $Lift<$Flip<$Before<$Stitch<': '>, $Show, 1>>>,
    $ComaJoin
]>;
declare type $ShowUnion = Flow<[
    $Union2Tuple,
    $MapOver<$Show>,
    $PipeJoin,
    $ParenWrap
]>;
declare type $ComaJoin = Flow<[$Assert<string[]>, $Join<', '>]>;
declare type $PipeJoin = Flow<[$Assert<string[]>, $Join<' | '>]>;
declare type $CurlyWrap = partialRight<$Stitch, ['{ ', ' }']>;
declare type $SquareWrap = partialRight<$Stitch, ['[', ']']>;
declare type $ParenWrap = partialRight<$Stitch, ['(', ')']>;
interface $Union2Tuple extends Type<1> {
    type: unknown extends this[A] ? unknown[] : Union2Tuple<this[A]>;
}
