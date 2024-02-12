import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { KanbanCard, KanbanList } from 'src/app/api/kanban';
import { KanbanService } from '../service/kanban.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DealsComponent } from '../deals.component';
import * as _ from 'lodash';
import { dealStatus, dealStatusHierarchy } from '../deals.helper';
import { XService } from 'src/app/api/x/x.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-kanban-list',
    templateUrl: './kanban-list.component.html',
    styleUrls: ['./kanban-list.component.scss']
})
export class KanbanListComponent implements OnInit {

    @Input() list!: KanbanList;

    @Input() listIds!: string[];

    menuItems: MenuItem[] = [];

    title: string = '';

    timeout: any = null;

    isMobileDevice: boolean = false;

    @ViewChild('inputEl') inputEl!: ElementRef;

    @ViewChild('listEl') listEl!: ElementRef;

    constructor(
        public parent: DealsComponent,
        private kanbanService: KanbanService,
        public keycloakService: KeycloakService,
        private xService: XService
    ) { }

    ngOnInit(): void {
        this.isMobileDevice = this.kanbanService.isMobileDevice();
        this.menuItems = [
            {
                label: 'List actions', items: [
                    { separator: true },
                    { label: 'Copy list', command: () => this.onCopy(this.list) },
                    {
                        label: 'Remove list', command: () => {
                            if (this.list.listId) {
                                this.onDelete(this.list.listId)
                            }
                        }
                    },
                ]
            }
        ];
    }

    toggleSidebar() {
        this.parent.sidebarVisible = true;
    }

    onDelete(id: string) {
        this.kanbanService.deleteList(id);
    }

    onCopy(list: KanbanList) {
        this.kanbanService.copyList(list);
    }

    onCardClick(event: Event, card: KanbanCard) {
        const eventTarget = event.target as HTMLElement;
        if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
            if (this.list.listId) {
                this.kanbanService.onCardSelect(card, this.list.listId);
            }
            this.parent.sidebarVisible = true;
        }
    }

    insertCard() {
        if (this.list.listId) {
            this.kanbanService.addCard(this.list.listId);
        }
        this.parent.sidebarVisible = true;
    }

    dropCard(event: CdkDragDrop<KanbanCard[]>): void {
        if (!this.keycloakService.isUserInRole('edit-deal')) { return }
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            if (dealStatusHierarchy[event.previousContainer.id] && dealStatusHierarchy[event.previousContainer.id].includes(event.container.id)) { // move only specific status
                if (!this.keycloakService.isUserInRole('manage-quote') && event.container.id === '4') { return }
                const card = event.previousContainer.data[event.previousIndex];
                card.status = _.find(dealStatus, (s) => s.listId === event.container.id)?.name;
                this.xService.updateX('deal', card, card.id);
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            } else {
                return;
            }
        }
    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }

}
