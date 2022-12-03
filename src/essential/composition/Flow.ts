import { Type } from 'free-types-core'
import { Next, Prev, Last } from 'free-types-core/dist/utils'
import { _Pipe, Composition } from './common';

export interface Flow<
    $Ts extends Composition & Composable,
    Composable = $Ts extends [Type] ? [Type] : Check<$Ts>
> extends Type<$Ts[0]['constraints']> {
    type: unknown[] extends this['arguments'] ? Last<$Ts>['type']
        : _Pipe<this['arguments'], $Ts>
}

type Check<T extends Composition, Acc = T[0], I extends number = 1> = 
    I extends T['length'] ? Acc
    : Check<T, Acc extends Composition
        ? CheckComposition<Acc, T[I]>
        : CheckFirst<T[0], T[1]>,
    Next<I>>

type CheckFirst<A extends Type, B extends Type> =
    A['type'] extends B['constraints'][0] ? [A, B]
    : [Type<A['constraints'], B['constraints'][0]>, B]

type CheckComposition<
    A extends Composition,
    B extends Type,
    L extends Type = Last<A>
> = L['type'] extends B['constraints'][0] ? [...A, B]
    : [...ReplaceLast<A, Type<L['constraints'], B['constraints'][0]>>, B]

type ReplaceLast<T extends unknown[], V> = {
    [K in keyof T]: K extends `${Prev<T['length']>}` ? V : T[K]
}