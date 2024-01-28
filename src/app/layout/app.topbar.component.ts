import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent {

    languageUpdate: boolean = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    constructor(public layoutService: LayoutService, public el: ElementRef, private translate: TranslateService) {}

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
