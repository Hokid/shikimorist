export const TYPES = {
  config: {
    shikimoriHost: Symbol.for('config.shikimoriHost'),
    clientId: Symbol.for('config.clientId'),
    clientSecret: Symbol.for('config.clientSecret'),
  },
  ApiClientFactory: Symbol.for('ApiClientFactory'),
  ApiDefaultAuthProvider: Symbol.for('ApiDefaultAuthProvider'),
  AuthorizationApi: Symbol.for('AuthorizationApi'),
  AnimesApi: Symbol.for('AnimesApi'),
  UsersRateApi: Symbol.for('UsersRateApi'),
  ProfileApi: Symbol.for('ProfileApi'),
  User: Symbol.for('User'),
  Store: Symbol.for('Store'),
  AnimeRates: Symbol.for('AnimesRates'),
  Animes: Symbol.for('Animes'),
  stores: {
    main: Symbol.for('stores.main'),
  }
};
