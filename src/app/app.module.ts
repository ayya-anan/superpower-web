import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy, CommonModule, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppTranslateRootModule } from './coreModules/app.translate.root.module';
import { AppProviderModule } from './coreModules/app.provider.module';
import { AppApiModule } from './coreModules/app.api.module';
import localeDe from '@angular/common/locales/de'; // Import German locale data
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
// Register the German locale data
registerLocaleData(localeDe);
import { AuthInterceptor, AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { keycloakConfig } from './keycloak-config';

function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: keycloakConfig,
            loadUserProfileAtStartUp: true,
            initOptions: {
                onLoad: 'login-required',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html'
            }
        });
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserModule,
        AppTranslateRootModule,
        KeycloakAngularModule,
        CommonModule,
        AppProviderModule,
        ToastModule,
        TranslateModule,
        AppApiModule.forRoot(),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // Set the default locale to German
        { provide: LOCALE_ID, useValue: 'de-DE' },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
