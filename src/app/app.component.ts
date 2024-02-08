import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNGConfig,
        private layoutService: LayoutService,
        translate: TranslateService,
        public oidcSecurityService: OidcSecurityService
    ) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;

        //optional configuration with the default configuration
        const config: AppConfig = {
            ripple: true,                      //toggles ripple on and off
            inputStyle: 'filled',             //default style for input elements
            menuMode: 'slim',                 //layout mode of the menu, valid values are "static", "overlay", "slim", "compact", "reveal", "drawer" and "horizontal"
            colorScheme: 'light',               //color scheme of the template, valid values are "light", "dim" and "dark"
            theme: 'blue',                      //default component theme for PrimeNG, see theme section for available values  
            menuTheme: 'indigo',              //theme of the menu, see menu theme section for available values  
            scale: 14                           //size of the body font size to scale the whole application
        };
        this.layoutService.config.set(config);

        this.oidcSecurityService
        .checkAuth()
        .subscribe(
          ({ isAuthenticated, userData, accessToken, idToken, configId }) => {
            console.log('callback authenticated', isAuthenticated);
          }
        );
    }
    login() {
        this.oidcSecurityService.authorize();
      }
    
      logout() {
        this.oidcSecurityService
          .logoff()
          .subscribe((result) => console.log(result));
      }
}
