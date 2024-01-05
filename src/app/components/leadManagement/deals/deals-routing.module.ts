import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DealsComponent } from './deals.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DealsComponent },

	])],
	exports: [RouterModule]
})
export class DealsRoutingModule { }
