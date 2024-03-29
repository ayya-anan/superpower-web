import { Component } from '@angular/core';
import { KanbanList } from 'src/app/api/kanban';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KanbanService } from './service/kanban.service';
import { KeycloakService } from 'keycloak-angular';
import { DealService } from 'src/app/api/leads/deal.service';

@Component({
    selector: 'app-deals',
    templateUrl: './deals.component.html',
    styleUrl: './deals.component.scss'
})
export class DealsComponent {

    sidebarVisible: boolean = false;

    lists: KanbanList[] = [];

    listIds: string[] = [];

    subscription = new Subscription();

    style!: HTMLStyleElement;

    isMobileDevice: boolean = false;
    showDealsPage: boolean = true;

    constructor(
        private kanbanService: KanbanService,
        private dealService: DealService,
        private keycloakService: KeycloakService,
    ) {
        this.subscription = this.kanbanService.lists$.subscribe(data => {
            this.lists = data;
            this.listIds = this.lists.map(l => l.listId || '');
        });
    }

    ngOnInit() {
        const roleValue = this.keycloakService.getUserRoles();
        if(roleValue && roleValue.includes('Team Members')) { this.showDealsPage = false;}
        this.removeLayoutResponsive();
        this.isMobileDevice = this.kanbanService.isMobileDevice();
    }

    toggleSidebar() {
        this.sidebarVisible = true;
    }

    addList() {
        this.kanbanService.addList();
    }

    dropList(event: CdkDragDrop<KanbanList[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    removeLayoutResponsive() {
        this.style = document.createElement('style');
        this.style.innerHTML = `
              .layout-content {
                  width: 100%;
              }
              
              .layout-topbar {
                  width: 100%;
              }
          `;
        document.head.appendChild(this.style);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        document.head.removeChild(this.style)
    }
}
