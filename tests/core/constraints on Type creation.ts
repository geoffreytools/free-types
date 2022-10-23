import { Type, A, B } from '../..';

// @ts-expect-error: wrong return type
interface $Foo extends Type<0, number> {
    type: 'hello'
}

// correctly extends Type<0, number>
interface $Bar extends Type<0, number> {
    type: 1
}

interface $Baz extends Type<1> {
    // @ts-expect-error: this does not extends Type<2>
    type: B<this>
}