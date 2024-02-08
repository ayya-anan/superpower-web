import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
    userData$: Observable<UserDataResult> |undefined;
    languageUpdate: boolean = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    constructor(public layoutService: LayoutService, public el: ElementRef, private translate: TranslateService, private oidcSecurityService: OidcSecurityService) {}
    ngOnInit(): void {
        this.userData$ = this.oidcSecurityService.userData$;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    useLanguage(): void {
        this.languageUpdate = !this.languageUpdate;
        this.translate.use((this.languageUpdate) ? 'en': 'de');
    }

    onProfileButtonClick() {
        this.layoutService.showRightMenu();
    }

    onSearchClick() {
        this.layoutService.toggleSearchBar();
    }

    onRightMenuClick() {
        this.layoutService.showRightMenu();
    }

    get logo() {
        const logo =
            this.layoutService.config().menuTheme === 'white' ||
            this.layoutService.config().menuTheme === 'orange'
                ? 'dark'
                : 'white';
        return logo;
    }
}
