import { test } from 'ts-spec'
import { $Const } from 'free-types-core';
import { MapOver } from '../../../essential/mappables/MapOver'
import { Ap } from '../../../essential/mappables/Ap'


type $123 = MapOver<[1,2,3], $Const>;
type $abc = MapOver<{ a: 1, b: 2, c: 3 }, $Const>;

test('Ap works on tuples' as const, t => 
    t.equal<Ap<$123, [0, 0, 0]>, [1,2,3]>(),
)

test('Ap preserves tupleness' as const, t => 
    t.equal<[...Ap<$123, [0, 0, 0]>], [1,2,3]>(),
)

test('Ap works on objects' as const, t => 
    t.equal<Ap<$abc, { a: 0, b: 0, c: 0 }>, { a: 1, b: 2, c: 3 }>()
)
