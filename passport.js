window.passport = new window.immutable.passport.Passport({
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
  clientId: 'pScQwAzjQsfsLuKBsUiBwJeMr6S7GeWa',
  redirectUri: 'https://special-primary-anchovy.ngrok-free.app',
  logoutRedirectUri: 'https://special-primary-anchovy.ngrok-free.app/logout.html',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});