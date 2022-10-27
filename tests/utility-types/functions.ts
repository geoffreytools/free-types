import { test } from 'ts-spec';
import { apply} from 'free-types-core';
import { $ReturnType, $Parameters, $Parameter } from '../../utility-types/functions';

type Fn = (...args: any[]) => unknown

test('$ReturnType' as const, t =>[
    t.equal<apply<$ReturnType, [(a: number) => void]>, void>(),
    t.equal<$ReturnType['constraints'], [Fn]>(),
    t.equal<$ReturnType['type'], unknown>(),
])

test('$Parameters' as const, t =>[
    t.equal<apply<$Parameters, [(a: number, b: string) => void]>, [number, string]>(),
    t.equal<$Parameters['constraints'], [Fn]>(),
    t.equal<$Parameters['type'], unknown[]>(),
])

test('$Parameter' as const, t =>[
    t.equal<apply<$Parameter<0>, [(a: number, b: string) => void]>, number>(),
    t.equal<$Parameter['constraints'], [number, Fn]>(),
    t.equal<$Parameter['type'], unknown>(),
])