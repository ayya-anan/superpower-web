import { ModuleWithProviders, NgModule } from '@angular/core';
import { IndividualsAPI } from '../api/contacts/individualsApi.service';
import { IndividualService } from '../api/contacts/individuals.service';
import { OrganizationService } from '../api/contacts/organization.service';
import { OrganizationAPI } from '../api/contacts/organizationApi.service';
import { DealService } from '../api/leads/deal.service';
import { DealAPI } from '../api/leads/dealApi.service';
import { XAPI } from '../api/x/xApi.service';
import { XService } from '../api/x/x.service';

const APIS = [
    IndividualsAPI,
    OrganizationAPI,
    DealAPI,
    XAPI
];

const CONTROLLERS = [
    IndividualService,
    OrganizationService,
    DealService,
    XService
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
