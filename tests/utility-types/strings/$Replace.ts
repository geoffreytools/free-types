import { test } from 'ts-test';
import { apply } from 'free-types-core';
import { $StrReplace } from '../../../utility-types/strings/$StrReplace';


test('Replace a Showable with another in a string' as const, t => [
    t.equal<
        apply<$StrReplace<'foo', 'bar'>, ['Je suuuis foo de voohoohoo']>,
        'Je suuuis bar de voohoohoo'
    >(),
    t.equal<
        apply<$StrReplace<1, 0>, ['I have 1 thing to say']>,
        'I have 0 thing to say'
    >()
])

test('Replace recursively' as const, t =>
    t.equal<
        apply<$StrReplace<'tchoo', 'foo'>, ['tchoo tchoo, chiii, tchoo tchoo']>,
        'foo foo, chiii, foo foo'
    >()
)

test('If the needle is not found, return the input unchanged' as const, t => [
    t.equal<apply<$StrReplace<'Ciao', 'Buongiorno'>, ['Hello']>, 'Hello'>(),
    t.equal<apply<$StrReplace<'Ciao', 'Buongiorno'>, ['']>, ''>(),
])

test('If the needle is the empty string, return the input unchanged' as const, t =>
    t.equal<apply<$StrReplace<'', 'Buongiorno'>, ['Hello']>, 'Hello'>(),
)