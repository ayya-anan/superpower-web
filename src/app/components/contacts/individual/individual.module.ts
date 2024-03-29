import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualComponent } from './individual.component';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { ChipModule } from "primeng/chip";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { IndividualRoutingModule } from './individual-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { FieldsetModule } from 'primeng/fieldset';
import { SidebarModule } from 'primeng/sidebar';
import { NgxPrintModule } from 'ngx-print';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		ColorPickerModule,
		CascadeSelectModule,
		MultiSelectModule,
		ToggleButtonModule,
		SliderModule,
		InputTextareaModule,
		RadioButtonModule,
		InputTextModule,
		RatingModule,
		ChipModule,
		KnobModule,
		InputSwitchModule,
		ListboxModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule,
		AccordionModule,
		ReactiveFormsModule,
		DialogModule,
		IndividualRoutingModule,
		AllTableModule,
		ToastModule,
		ToolbarModule,
		ConfirmDialogModule,
		BadgeModule,
		FieldsetModule,
		SidebarModule,
		NgxPrintModule,
		AppTranslateChildModule
	],
	declarations: [IndividualComponent]
})
export class IndividualModule { }
