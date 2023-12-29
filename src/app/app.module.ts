import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppTranslateRootModule } from './coreModules/app.translate.root.module';
import { AppProviderModule } from './coreModules/app.provider.module';
import { AppApiModule } from './coreModules/app.api.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        AppTranslateRootModule,
        CommonModule,
        AppProviderModule,
        AppApiModule.forRoot(),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
