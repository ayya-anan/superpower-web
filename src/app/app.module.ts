import { LOCALE_ID, NgModule } from '@angular/core';
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
// Register the German locale data
registerLocaleData(localeDe);
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserModule,
        AppTranslateRootModule,
        CommonModule,
        AppProviderModule,
        ToastModule,
        AppApiModule.forRoot(),
    ],
    providers: [
        MessageService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // Set the default locale to German
        { provide: LOCALE_ID, useValue: 'de-DE' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
