import { Component, Input, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { KanbanCard } from 'src/app/api/kanban';
import { KanbanService } from '../service/kanban.service';
import { Subscription } from 'rxjs';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import * as _ from 'lodash';
import { XService } from 'src/app/api/x/x.service';
import { dealStatus } from '../deals.helper';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-kanban-card',
    templateUrl: './kanban-card.component.html'
})
export class KanbanCardComponent implements OnDestroy {

    @Input() card!: KanbanCard;

    @Input() listId!: string;
    menuItems: MenuItem[] = [];
    subscription: Subscription;

    constructor(
        private kanbanService: KanbanService,
        private organizationService: OrganizationService,
        public keycloakService: KeycloakService,
        private xService: XService,
    ) {
        this.organizationService.getAllOrganization();
        this.subscription = this.kanbanService.lists$.subscribe(data => {
            let subMenu = data.map(d => ({ id: d.listId, label: d.name, command: () => this.onMove(d.listId) }));
            this.generateMenu(subMenu);
        })
    }

    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }
    getOrgName(id: string) {
        if (this.organizationService.allorg && this.organizationService.allorg.results && this.organizationService.allorg.results.length > 0) {
            const org = _.find(this.organizationService.allorg.results, (org) => org.id === id);
            if (org) { return org.primaryDetails.name; }
        }
        return id;
    }
    onDelete() {
        this.xService.deleteX('deal', this.card.id);
        this.kanbanService.deleteCard(this.card.id, this.listId);
    }

    onCopy() {
        this.kanbanService.copyCard(this.card, this.listId);
    }

    onMove(listId: string) {
        this.card.status = _.find(dealStatus, (s) => s.listId === listId)?.name
        this.xService.updateX('deal', this.card, this.card.id);
        this.kanbanService.moveCard(this.card, listId, this.listId);
    }

    generateMenu(subMenu: any[]) {
        this.menuItems = [
            // { label: 'Copy card', command: () => this.onCopy() },
            // { label: 'Move card', items: subMenu },
            { label: 'Delete card', command: () => this.onDelete() }
        ];
    }

    generateTaskInfo() {
        let total = this.card.taskList.tasks.length;
        let completed = this.card.taskList.tasks.filter(t => t.completed).length;
        return `${completed} / ${total}`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
