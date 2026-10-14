// This version of Show/$Show exists to showcase over-engineering
// A plain version exists under strings/

import { _apply, _Type, Checked, A, Const, Type, unwrap, partialRight, Flow, $Before } from 'core';
import { IsAny, IsUnion, Union2Tuple } from 'utils';
import { $Flip } from 'adapters/$Flip';
import { $Lift } from 'mappables/Lift';
import { $MapOver } from 'mappables/MapOver';
import { $Join } from '../strings/$Join';
import { $Stitch } from '../strings/$Stitch';
import { Showable } from '../strings/common';
import { $Assert } from 'essential/composition/$Assert';

export { Show, $Show }

/** @deprecated Prefer `free-types/strings/Show` */
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
    : T extends { [k: PropertyKey]: unknown } ? $ShowObject
    : T extends { [k: PropertyKey]: any } ? $ShowClass
    : Const<'(unknown type)'>
) extends infer $T extends { type: string } ? _apply<$T, [T]> : never

/** @deprecated Prefer `free-types/strings/Show` */
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

interface $ShowClass extends Type<[{ [k: PropertyKey]: any }]> {
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

type Az = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

interface $ShowArray extends Type<[{[k: number]: unknown}]> {
    type: `${Show<A<this>[0]>}[]`
}
type $ShowTuple = Flow<[$ShowList, $SquareWrap]>;

type $ShowList = Flow<[$MapOver<$Show>, $ComaJoin]>;

type $ShowObject = Flow<[$Entries, $MapOver<$KeyValuePair>, $ComaJoin, $CurlyWrap]>;

type $KeyValuePair = Flow<[$MapOver<$Show>, $ColonJoin]>;

type $ShowArgs = Flow<[
    $Lift<$Flip<$Before<$Stitch<': '>, $Show, 1>>>, $Assert<string[]>, $ComaJoin
]>;

type $ShowUnion = Flow<[
    $Union2Tuple, $MapOver<$Show>, $PipeJoin, $ParenWrap
]>;

type $ComaJoin = Flow<[$Assert<string[]>, $Join<', '>]>;
type $PipeJoin = Flow<[$Assert<string[]>, $Join<' | '>]>;
type $ColonJoin = Flow<[$Assert<string[]>, $Join<': '>]>;

type $CurlyWrap = partialRight<$Stitch, ['{ ', ' }']>
type $SquareWrap = partialRight<$Stitch, ['[', ']']>
type $ParenWrap = partialRight<$Stitch, ['(', ')']>

interface $Union2Tuple extends Type<[unknown]> {
    type: unknown extends this[A] ? unknown[] : Union2Tuple<this[A]>
}

interface $Entries extends Type<[{ [k: PropertyKey]: unknown }]> {
    type: unknown extends this[A] ? [PropertyKey, unknown][]
        : Entries<this[A], Union2Tuple<keyof this[A]>>
}

type Entries<T, Keys> = { [I in keyof Keys]: [Keys[I], T[Keys[I] & keyof T]] };