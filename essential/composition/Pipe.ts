import { _Pipe, Composition } from "./common";

export { Pipe, PipeUnsafe }

type Pipe<
    Args extends $Ts[0]['constraints'],
    $Ts extends [Result] extends [never] ? never : Composition,
    // @ts-ignore: prevent users from messing with it
    Result extends never = _Pipe<Args, $Ts>
    //     -------------
> = Result

type PipeUnsafe<Args extends $Ts[0]['constraints'], $Ts extends Composition> =
    _Pipe<Args, $Ts>;
