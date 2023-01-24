import { Type, apply, At } from 'free-types-core';
import { test } from 'ts-spec';

interface $20Ary extends Type<20> {
    type: {[k in '20th']: this[19] }
}

interface $20Ary2 extends Type<20> {
    type: {[k in '20th']: At<19, this> }
}

type args = [
    1,2,3,4,5,6,7,8,9,10,
    11,12,13,14,15,16,17,18,19,'hey'
];

test('Unbound number of args' as const, t => [
    t.equal<apply<$20Ary, args>, {'20th': 'hey'}>(),
    t.equal<apply<$20Ary2, args>, {'20th': 'hey'}>()
])