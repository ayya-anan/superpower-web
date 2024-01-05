import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DealsComponent } from './deals.component';
import { DealsRoutingModule } from './deals-routing.module';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { KanbanSidebarComponent } from './kanban-sidebar/kanban-sidebar.component';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { InplaceModule } from 'primeng/inplace';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { KanbanService } from './service/kanban.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@NgModule({
	imports: [
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		InputTextareaModule,
		InputTextModule,
		InputGroupAddonModule,
		InputGroupModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule,
		ReactiveFormsModule,
		DialogModule,
		CommonModule,
		FormsModule,
        DealsRoutingModule,
        DragDropModule,
        ButtonModule,
        RippleModule,
        ProgressBarModule,
        AvatarModule,
        AvatarGroupModule,
        InputTextModule,
        ChipsModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        SidebarModule,
        MenuModule,
        InplaceModule,
        AutoCompleteModule,
        TooltipModule,
        TieredMenuModule,
        OverlayPanelModule,
        CheckboxModule
	],
	declarations: [
        DealsComponent,
        KanbanListComponent,
        KanbanSidebarComponent,
        KanbanCardComponent
    ],
    providers: [KanbanService]
})
export class DealsModule { }
