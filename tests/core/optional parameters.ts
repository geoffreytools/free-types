import { Type, A, B, C, D, apply, Optional, partial } from 'free-types-core';

import { test } from 'ts-spec';
import { _partial, _ } from '../../essential';

test('1 optional parameter' as const, t => {
    interface $OptionalBox3 extends Type<[number, number, number?]> {
        type: `${A<this>} x ${B<this>} x ${Optional<C, this>}`
    }
    
    return [
        t.equal<apply<$OptionalBox3, [1, 2]>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptionalBox3, [1, 2, 3]>, `1 x 2 x 3`>()
    ]
})

test('2 optional parameters' as const, t => {
    interface $OptionalBox3 extends Type<[number, number?, number?]> {
        type: `${A<this>} x ${Optional<B, this>} x ${Optional<C, this>}`
    }
    
    return [
        t.equal<apply<$OptionalBox3, [1]>, `1 x ${number} x ${number}`>(),
        t.equal<apply<$OptionalBox3, [1, 2]>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptionalBox3, [1, 2, 3]>, `1 x 2 x 3`>()
    ]
})


interface $OptionalBox3 extends Type<[number, number, number?]> {
    // @ts-expect-error: Optional type checks the indexation
    type: `${A<this>} x ${B<this>} x ${Optional<D, this>}`
}

test('Default value' as const, t => {
    interface $OptionalBox3 extends Type<[number, number, number?]> {
        type: `${A<this>} x ${B<this>} x ${Optional<C, this, B<this>>}`
    }
    
    return [
        t.equal<apply<$OptionalBox3, [1, 2]>, `1 x 2 x 2`>(),
        t.equal<apply<$OptionalBox3, [1, 2, 3]>, `1 x 2 x 3`>()
    ]
})

test('integration with partial' as const, t => {
    interface $OptionalBox3 extends Type<[number, number, number?]> {
        type: `${A<this>} x ${B<this>} x ${Optional<C, this>}`
    }

    type $OptBox1_3 = partial<$OptionalBox3, [1]>;
    type $OptBox2_3 = partial<$OptionalBox3, [1, 2]>;
    type $OptBox3_3 = partial<$OptionalBox3, [1, 2, 3]>;
    
    return [
        t.equal<apply<$OptBox1_3, [2]>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptBox1_3, [2, 3]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptBox2_3>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptBox2_3, [3]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptBox3_3>, `1 x 2 x 3`>()
    ]
})

test('integration with _partial' as const, t => {
    interface $OptionalBox3 extends Type<[number, number?, number?]> {
        type: `${A<this>} x ${Optional<B, this>} x ${Optional<C, this>}`
    }

    type $OptBox1_3 = _partial<$OptionalBox3, [1]>;
    type $OptBox2_3 = _partial<$OptionalBox3, [1, 2]>;
    type $OptBox3_3 = _partial<$OptionalBox3, [1, 2, 3]>;

    type $OptBox2_3_ = _partial<$OptionalBox3, [1, _, 3]>;
    type $OptBox1_3_ = _partial<$OptionalBox3, [_, 2]>;
    
    return [
        t.equal<apply<$OptBox1_3, [2]>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptBox1_3, [2, 3]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptBox2_3>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptBox2_3, [3]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptBox3_3>, `1 x 2 x 3`>(),

        t.equal<apply<$OptBox2_3_, [2]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptBox1_3_, [1]>, `1 x 2 x ${number}`>(),
    ]
})