import { ModuleWithProviders, NgModule } from '@angular/core';
import { IndividualsAPI } from '../api/contacts/individualsApi.service';
import { IndividualService } from '../api/contacts/individuals.service';

const APIS = [
    IndividualsAPI
];

const CONTROLLERS = [
    IndividualService,
];

@NgModule({
    imports: [
        
    ]
})
export class AppApiModule {
    static forRoot(): ModuleWithProviders<AppApiModule> {
        return {
            ngModule: AppApiModule,
            providers: [...APIS, ...CONTROLLERS]
        };
    }
}
