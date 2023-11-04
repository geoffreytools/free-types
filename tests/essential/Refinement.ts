import { test } from 'ts-spec'
import { apply } from 'free-types-core';
import { $Extends, Refinement } from 'src'

type $IsNumber = $Extends<number>;

test('$Refine takes a boolean predicate and turns it into a Refinement', t => [
    t.equal<Refinement.$Refine<$IsNumber, number>['type'], number>(),
    t.equal<apply<Refinement.$Refine<$IsNumber, number>, [1]>, number>(),
    t.equal<apply<Refinement.$Refine<$IsNumber, number>, ['a']>, never>(),
])

test('$Reject takes a boolean predicate and turns it into a flipped Refinement', t => [
    t.equal<Refinement.$Reject<$IsNumber>['type'], unknown>(),
    t.equal<apply<Refinement.$Reject<$IsNumber>, [1]>, never>(),
    t.equal<apply<Refinement.$Reject<$IsNumber>, ['a']>, unknown>(),
])

test('$Reject can arbitrarily narrow', t => [
    t.equal<Refinement.$Reject<$IsNumber, string>['type'], string>(),
    t.equal<apply<Refinement.$Reject<$IsNumber, string>, [1]>, never>(),
    t.equal<apply<Refinement.$Reject<$IsNumber, string>, ['a']>, string>(),
])

type $isNumRef = Refinement.$Refine<$IsNumber, number>

test('$Flip takes a refinment predicate and flips it', t => [
    t.equal<Refinement.$Flip<$isNumRef>['type'], unknown>(),
    t.equal<apply<Refinement.$Flip<$isNumRef>, [1]>, never>(),
    t.equal<apply<Refinement.$Flip<$isNumRef>, ['a']>, unknown>(),
])

test('$Flip can arbitrarily narrow', t => [
    t.equal<Refinement.$Flip<$isNumRef, string>['type'], string>(),
    t.equal<apply<Refinement.$Flip<$isNumRef, string>, [1]>, never>(),
    t.equal<apply<Refinement.$Flip<$isNumRef, string>, ['a']>, string>(),
])