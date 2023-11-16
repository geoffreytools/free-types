import { _apply, _Type, Checked, A, Const, Type, unwrap, free, partialRight, Flow, $Before } from "free-types-core";
import { IsAny } from "free-types-core/dist/utils";
import { $Arity } from "../essential/adapters/$Arity";
import { $Flip } from "../essential/adapters/$Flip";
import { IsUnion, Union2Tuple } from "../essential/utils";
import { Key } from "../essential/mappables/common";
import { $Lift } from "../essential/mappables/Lift";
import { $MapOver } from "../essential/mappables/MapOver";
import { $Join } from "../utility-types/strings/$Join";
import { $Stitch } from "../utility-types/strings/$Stitch";
import { Showable } from "../utility-types/strings/common";
import { $Assert } from "../essential/composition/$Assert";
import { $Object2Tuple } from "../essential/mappables/Object2Tuple";

export { Show, $Show }

type Show<T> = (
    IsAny<T> extends true ? Const<'any'>
    : unknown extends T ? Const<'unknown'>
    : boolean extends T ? Const<'boolean'>
    : IsUnion<T> extends true ? $ShowUnion
    : [T] extends [never] ? Const<'never'>
    : [T] extends [symbol] ? Const<'symbol'>
    : [T] extends [Showable] ? $ShowShowable
    : T extends (...args: any[]) => unknown ? $ShowFunction
    : T extends Tuple ? $ShowTuple
    : T extends unknown[] ? $ShowArray
    : T extends { [k: Key]: unknown } ? $ShowObject
    : T extends { [k: Key]: any } ? $ShowClass
    : Const<'(unknown type)'>
) extends infer $T extends { type: string } ? _apply<$T, [T]> : never

interface $Show extends Type<1> {
    type: unknown extends this[0] ? string : Show<this[0]>
}

type Tuple = [] | [unknown, ...unknown[]];

interface $ShowShowable extends Type<[Showable]> {
    type: number extends this[0] ? 'number'
        : string extends this[0] ? 'string'
        : this[0] extends bigint ? 'bigint'
        : `${this[0] & Showable}`
}

interface $ShowClass extends Type<[{ [k: Key]: any }]> {
    type: [this['Unwrapped']] extends [never]
        ? '(unknown custom type)'
        : `${this['Unwrapped']['URI']}<${
            _apply<$ShowList, [this['Unwrapped']['args']]>
        }>`
    Unwrapped: unwrap<this[0]>
}

interface $ShowFunction extends Type<[(...args: any[]) => unknown]> {
    type: `(${this['Input']}) => ${this['Output']}`

    Output: undefined extends this['Return'] ? 'void' : Show<this['Return']>
    Return: ReturnType<Checked<0, this>>

    Input: this['Args'] extends [] ? ''
         : this['Args'] extends Tuple ? this['TupleArgs']
         : this['ArrayArgs']

    Args: Parameters<Checked<0, this>>
    TupleArgs: _apply<$ShowArgs, [this['Args'], Az]>
    ArrayArgs: `...args: ${_apply<$ShowArray, [this['Args']]>}`
}

type Az = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "k", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

interface $ShowArray extends Type<[{[k: number]: unknown}]> {
    type: `${Show<A<this>[0]>}[]`
}
type $ShowTuple = Flow<[$ShowList, $SquareWrap]>;

type $ShowList = Flow<[$MapOver<$Show>, $ComaJoin]>;

type $ShowObject = Flow<[$MapOver<$KeyValuePair>, $Object2Tuple, $ComaJoin, $CurlyWrap]>;

type $KeyValuePair = Flow<[
    $Flip<$Arity<2, $Before<free.Tuple, $Show>>>, $Join<': '>
]>;

type $ShowArgs = Flow<[
    $Lift<$Flip<$Before<$Stitch<': '>, $Show, 1>>>, $Assert<string[]>, $ComaJoin
]>;

type $ShowUnion = Flow<[
    $Union2Tuple, $MapOver<$Show>, $PipeJoin, $ParenWrap
]>;

type $ComaJoin = Flow<[$Assert<string[]>, $Join<', '>]>;
type $PipeJoin = Flow<[$Assert<string[]>, $Join<' | '>]>;

type $CurlyWrap = partialRight<$Stitch, ['{ ', ' }']>
type $SquareWrap = partialRight<$Stitch, ['[', ']']>
type $ParenWrap = partialRight<$Stitch, ['(', ')']>

interface $Union2Tuple extends Type<[unknown]> {
    type: unknown extends this[A] ? unknown[] : Union2Tuple<this[A]>
}