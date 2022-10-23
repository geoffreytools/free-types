import { test, } from 'ts-test';
import { Type, apply, partial, Remaining, A, B, C, D, partialRight } from 'free-types-core'
import { _partial } from '../../../essential/_partial';

type Qux<
    A extends string,
    B extends number,
    C extends undefined,
    D extends boolean
> = [A, B, C, D];

interface $Qux extends Type<[string, number, undefined, boolean]> {
    type: Qux<A<this>, B<this>, C<this>, D<this>>
}


{   // shallow

    type Foo<
        A extends string,
        B extends number,
        C extends undefined
    > = Bar<partial<$Qux, [A, B, C]>>;

    type Bar<Q extends Type<[boolean]>> =
        apply<Q, [true]>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<'foo', 2, undefined>,
            ["foo", 2, undefined, true]
        >()
    );
}

{   // deep
    
    type Foo<
        A extends string,
        B extends number,
    > = Bar<partial<$Qux, [A, B]>, undefined>;
    
    type Bar<
        $Q extends Type<[undefined, boolean]>,
        C extends undefined,
        // $Model enables $Q to be generic
    > = Baz<partial<$Q, [C], Type<[undefined, boolean]>>>
        //                   --------------------------

    type Baz<Q extends Type<[boolean]>> =
        apply<Q, [true]>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<'foo', 2>,
            ["foo", 2, undefined, true]
        >()
    );
}

{   // shallow using Remaining

    type Foo<
        A extends string,
        B extends number,
        C extends undefined
    > = Bar<partial<$Qux, [A, B, C]>>;

    type Bar<Q extends Remaining<$Qux, 1>> =
        apply<Q, [true]>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<'foo', 2, undefined>,
            ["foo", 2, undefined, true]
        >()
    );
}

{   // deep using Remaining
    
    type Foo<
        A extends string,
        B extends number,
    > = Bar<partial<$Qux, [A, B]>, undefined>;
    
    type Bar<
        $Q extends Remaining<$Qux, 2>,
        C extends undefined,
        // $Model enables $Q to be generic
    > = Baz<partial<$Q, [C], Remaining<$Qux, 2>>>
        //                   ------------------

    type Baz<Q extends Remaining<$Qux, 1>> =
        apply<Q, [true]>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<'foo', 2>,
            ["foo", 2, undefined, true]
        >()
    );

}

{   // shallow Right

    type Foo<
        A extends number,
        B extends undefined,
        C extends boolean
    > = Bar<partialRight<$Qux, [A, B, C]>>;

    type Bar<Q extends Type<[string]>> =
        apply<Q, ['foo']>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<2, undefined, true>,
            ["foo", 2, undefined, true]
        >()
    );
}

{   // deep Right
    
    type Foo<
        A extends undefined,
        B extends boolean,
    > = Bar<partialRight<$Qux, [A, B]>, 2>;
    
    type Bar<
        $Q extends Type<[string, number]>,
        C extends number,
        // $Model enables $Q to be generic
    > = Baz<partialRight<$Q, [C], Type<[string, number]>>>
        //                        ----------------------

    type Baz<Q extends Type<[string]>> =
        apply<Q, ['foo']>

    test('partial passing down args' as const, t => 
        t.equal<
            Foo<undefined, true>,
            ["foo", 2, undefined, true]
        >()
    );
}