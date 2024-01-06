import { ModuleWithProviders, NgModule } from '@angular/core';
import { IndividualsAPI } from '../api/contacts/individualsApi.service';
import { IndividualService } from '../api/contacts/individuals.service';
import { OrganizationService } from '../api/contacts/organization.service';
import { OrganizationAPI } from '../api/contacts/organizationApi.service';

const APIS = [
    IndividualsAPI,
    OrganizationAPI
];

const CONTROLLERS = [
    IndividualService,
    OrganizationService
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
