export type ServerStatus =
    | 'uninitialized'
    | 'initialization'
    | 'initialized'
    | 'error';

export type ClientStatus = 'wait' | 'connecting' | 'connected' | 'connection-error';

