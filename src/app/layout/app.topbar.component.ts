import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import * as _ from 'lodash';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
    languageUpdate: boolean = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    username: string | undefined;

    constructor(public layoutService: LayoutService, public el: ElementRef, private translate: TranslateService,private keycloakService: KeycloakService) {}
    ngOnInit(): void {
        this.username = _.upperFirst(this.keycloakService.getUsername());
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
    logout(){
        this.keycloakService.logout();
    }
}
