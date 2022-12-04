import { _Pipe, Composition } from "./common";
export { Pipe, PipeUnsafe };
declare type Pipe<
    Args extends $Ts[0]['constraints'],
    $Ts extends [Result] extends [never] ? never : Composition,
    // @ts-ignore: prevent user from messing with it
    //     vvvvvvvvvvvvv
    Result extends never = _Pipe<Args, $Ts>
> = Result;
declare type PipeUnsafe<Args extends $Ts[0]['constraints'], $Ts extends Composition> = _Pipe<Args, $Ts>;
