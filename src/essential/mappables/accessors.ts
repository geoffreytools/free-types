import { Type, A, B, C, Checked } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
import { $Optional } from '../adapters/$Optional';
import { Key, Obj } from './common'

export { $Prop, $Index, $SetProp, $SetIndex, }

type $SetProp<V = never, K extends Key = never> =
    $Optional<$SetProp3, [V, K]>

interface $SetProp3 extends Type<[unknown, Key, Obj]> {
    type: this[B] extends string ? this[C] extends Record<this[B], unknown>
        ? SetProp<this[C], B<this>, A<this>>
        : this[C] : Obj
}

type SetProp<T extends Obj, A extends Key, V> = {
    [K in keyof T as FilteredKeys<T, K>]: K extends A | `${A & string}` ? V : T[K]
}

type FilteredKeys<T, K extends keyof T> =
    [unknown] extends [T[K]]
    ? string extends K ? never
    : number extends K ? never
    : symbol extends K ? never
    : K : K

type $SetIndex<V = never, I extends number = never> =
    $Optional<$SetIndex3, [V, I]>

interface $SetIndex3 extends Type<[unknown, number, unknown[]]> {
    type: SetIndex<B<this>, A<this>, Checked<C, this>>
}

type SetIndex<
    A extends number,
    V,
    T extends unknown[],
    I extends number = 0,
    R extends unknown[] = []
> = number extends T['length']
    ? T
    : I extends T['length']
    ? R
    : SetIndex<A, V, T, Next<I>, [...R, I extends A ? V : T[I]]>

interface $Prop<K extends Key = never, R = unknown> extends Type {
    type: [K] extends [never]
        ? this[A] extends Key
            ? this[B] extends Record<this[A], unknown>
                ? this[B][this[A]] : never : unknown

        : this[A] extends Record<K, R> ? this[A][K] : R

    constraints: [K] extends [never]
        ? [Key, Record<Key, R>]
        : [{[_ in K]: R}]
}

interface $Index<I extends number = never, R = unknown> extends Type {
    type: [I] extends [never] 
        ? this[A] extends number
            ? this[B] extends Record<this[A], unknown>
                ? this[B][this[A]] : never : unknown

        : this[A] extends Record<I, R> ? this[A][I] : R

    constraints: [I] extends [never]
        ? [number, R[]]
        : [R[] & {[_ in I]: R}]
}

