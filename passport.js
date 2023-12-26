window.passport = new window.immutable.passport.Passport({
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
  clientId: 'pScQwAzjQsfsLuKBsUiBwJeMr6S7GeWa',
  redirectUri: 'https://stackup.10level.com',
  logoutRedirectUri: 'https://stackup.10level.com/logout.html',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});