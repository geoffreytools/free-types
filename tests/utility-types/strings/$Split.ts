import { test } from 'ts-test';
import { apply } from 'free-types-core';
import { $Split } from '../../../utility-types/strings/$Split';

test('Divide a string based on separator' as const, t => [
    t.equal<apply<$Split<'-'>, ['foo-bar']>, ['foo','bar']>(),
])

test('When separator is an empty string, explode the string' as const, t => [
    t.equal<
        apply<$Split<''>, ['foo-bar']>,
        ["f", "o", "o", "-", "b", "a", "r"]
    >(),
])

test('Wrap the input in a tuple if there is no match' as const, t => [
    t.equal<apply<$Split<'*'>, ['foo-bar']>, ['foo-bar']>(),
])

test('Partial matches are represented with an empty string' as const, t => [
    t.equal<apply<$Split<'-'>, ['foo-']>, ['foo', '']>(),
    t.equal<apply<$Split<'-'>, ['-bar']>, ['', 'bar']>(),
    t.equal<apply<$Split<'-'>, ['foo-bar-']>, ['foo', 'bar', '']>(),
    t.equal<apply<$Split<'-'>, ['-foo-bar']>, ['', 'foo', 'bar']>()
])

test('Return `[""]` when the input is an empty string' as const, t => [
    t.equal<apply<$Split<''>, ['']>, ['']>(),
    t.equal<apply<$Split<'-'>, ['']>, ['']>(),
])


test('Return `["", ""]` when the input and separator match exactly' as const, t => [
    t.equal<apply<$Split<'-'>, ['-']>, ['','']>(),
])


test('Signature' as const, t => [
    t.equal<$Split['constraints'], [string, string]>(),
    t.equal<$Split['type'], string[]>(),
    t.equal<$Split<''>['type'], string[]>(),
])
