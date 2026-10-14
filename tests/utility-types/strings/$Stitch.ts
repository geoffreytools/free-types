import { apply } from 'free-types-core/dist/apply';
import { test } from 'ts-spec';
import { $Stitch } from '../../../src/strings/$Stitch';
import { Showable } from '../../../src/strings/common';


test('Concatenate the supplied Showables' as const, t => [
    t.equal<apply<$Stitch, ['-', 'A', 'B']>, 'A-B'>(),
    t.equal<apply<$Stitch<'-'>, [ 'A', 'B']>, 'A-B'>(),
    t.equal<$Stitch['type'], string>()
])

test('Signature' as const, t => [
    t.equal<$Stitch['constraints'], [Showable, Showable, Showable]>(),
    t.equal<$Stitch['type'], string>(),
    t.equal<$Stitch<''>['type'], string>(),
    t.equal<$Stitch<'', ''>['type'], string>()
])
