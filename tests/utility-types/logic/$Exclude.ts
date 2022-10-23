import { apply } from 'free-types-core';
import { test } from 'ts-test';
import { $Exclude } from '../../../utility-types/logic/';


test('$Exclude' as const, t => 
    t.equal<
        apply<$Exclude<string>, [string | number]>,
        Exclude<string | number, string>
    >(),
)