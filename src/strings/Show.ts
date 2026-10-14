import { Type, unwrap } from 'core';
import { IsAny, IsUnion, Union2Tuple } from 'utils';
import { Showable } from './common';

export { Show, $Show }

type Show<T> =
    IsAny<T> extends true ? 'any'
    : unknown extends T ? 'unknown'
    : boolean extends T ? 'boolean'
    : IsUnion<T> extends true ? `(${Join<ShowEach<Union2Tuple<T>>, ' | '>})`
    : [T] extends [never] ? 'never'
    : [T] extends [symbol] ? 'symbol'
    : [T] extends [Showable] ? ShowShowable<T>
    : T extends (...args: any[]) => unknown ? ShowFunction<T>
    : T extends Tuple ? `[${ShowList<T>}]`
    : T extends unknown[] ? ShowArray<T>
    : T extends { [k: PropertyKey]: unknown } ? `{ ${Join<ShowEntries<T>, ', '>} }`
    : T extends { [k: PropertyKey]: any } ? ShowClass<unwrap<T>>
    : '(unknown type)'

interface $Show extends Type<1> {
    type: unknown extends this[0] ? string : Show<this[0]>
}

type Tuple = [] | [unknown, ...unknown[]];

type ShowShowable<T extends Showable> =
    number extends T ? 'number'
    : string extends T ? 'string'
    : T extends bigint ? 'bigint'
    : `${T}`

type ShowClass<U> = [U] extends [never]
    ? '(unknown custom type)'
    : U extends { URI: infer URI extends string, args: infer Args}
    ? `${URI}<${ShowList<Args>}>`
    : never

type ShowFunction<F extends (...args: any[]) => unknown> =
    `(${ShowParameters<Parameters<F>>}) => ${ShowReturn<ReturnType<F>>}`

type ShowReturn<T> = undefined extends T ? 'void' : Show<T>

type ShowParameters<Args extends unknown[]> =
    Args extends [] ? ''
    : Args extends Tuple ? Join<NameEach<Args>, ', '>
    : `...args: ${ShowArray<Args>}`

type NameEach<Args extends unknown[]> = {
    [K in keyof Args]: `${Az[K & keyof Az]}: ${Show<Args[K]>}`
}

type Az = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

type ShowArray<T extends unknown[]> = `${Show<T[0]>}[]`

type ShowList<T> = Join<ShowEach<T>, ', '>

type ShowEach<T> = { [K in keyof T]: Show<T[K]> }

type ShowEntries<T, Keys = Union2Tuple<keyof T>> = {
    [K in keyof Keys]: `${Show<Keys[K]>}: ${Show<T[Keys[K] & keyof T]>}`
}

type Join<T, Separator extends string> =
    T extends [infer First extends string, ...infer Rest]
        ? Concat<Rest, Separator, First>
        : ''

type Concat<T, Separator extends string, Joined extends string> =
    T extends [infer Head extends string, ...infer Rest]
        ? Concat<Rest, Separator, `${Joined}${Separator}${Head}`>
        : Joined
