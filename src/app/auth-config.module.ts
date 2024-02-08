import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        postLoginRoute: '/dashboard',
        forbiddenRoute: '/forbidden',
        unauthorizedRoute: '/unauthorized',
        logLevel: LogLevel.Debug,
        historyCleanupOff: true,
        authority: 'https://idpkc.azurewebsites.net/auth/realms/master',
        redirectUrl: `${window.location.origin}/callback`,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'superpower-web',
        scope: 'openid profile email roles',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        secureRoutes:['http://localhost:3001','https://superpowerwebapi.azurewebsites.net']
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
