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
import { AccordionModule, AccordionTab } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';
import { InvoiceComponent } from '../invoice/invoice.component';
import { EditorModule } from "primeng/editor";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxPrintModule } from 'ngx-print';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RadioButtonModule } from 'primeng/radiobutton';

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
        SplitButtonModule,
        RippleModule,
        ProgressBarModule,
        AvatarModule,
        AccordionModule,
        AvatarGroupModule,
        InputTextModule,
        ChipsModule,
        CalendarModule,
        ChipModule,
        DropdownModule,
        InputTextareaModule,
        SidebarModule,
        MenuModule,
        InplaceModule,
        AutoCompleteModule,
        TooltipModule,
        TieredMenuModule,
        OverlayPanelModule,
        CardModule,
        BadgeModule,
        CheckboxModule,
        RadioButtonModule,
        EditorModule,
        ToastModule,
        ConfirmDialogModule,
        AllTableModule,
        NgxPrintModule,
        AppTranslateChildModule
	],
	declarations: [
        DealsComponent,
        KanbanListComponent,
        KanbanSidebarComponent,
        InvoiceComponent,
        KanbanCardComponent
    ],
    providers: [KanbanService,ConfirmationService,MessageService]
})
export class DealsModule { }
