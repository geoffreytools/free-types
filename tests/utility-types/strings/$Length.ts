import { apply } from 'free-types-core'
import { test } from 'ts-spec'
import { $Length } from '../../../dist/utility-types/strings/$Length'

test('Get the length of the supplied string' as const, t => [
    t.equal<apply<$Length, ['abc']>, 3>(),
    t.equal<apply<$Length, ['']>, 0>()
])

test('Signature' as const, t => [
    t.equal<$Length['constraints'], [string]>(),
    t.equal<$Length['type'], number>(),
])
