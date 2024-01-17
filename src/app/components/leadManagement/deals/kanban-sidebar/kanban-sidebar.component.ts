import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { KanbanCard, Comment, ListName, Task } from 'src/app/api/kanban';
import { Member } from 'src/app/api/member';
import { MemberService } from 'src/app/service/member.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { KanbanService } from '../service/kanban.service';
import { DealsComponent } from '../deals.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { DealService } from 'src/app/api/leads/deal.service';
import * as moment from 'moment';

@Component({
    selector: 'app-kanban-sidebar',
    templateUrl: './kanban-sidebar.component.html',
    styleUrls: ['./kanban-sidebar.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class KanbanSidebarComponent implements OnDestroy {

    card: KanbanCard = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };

    formValue!: KanbanCard;

    listId: string = '';

    filteredAssignees: Member[] = [];

    assignees: Member[] = [];

    newComment: Comment = { id: '123', name: 'Jane Cooper', text: '' };

    newTask: Task = { text: '', completed: false };

    comment: string = '';

    taskContent: string = '';

    timeout: any = null;

    showTaskContainer: boolean = false;

    menuItems: MenuItem[] = [];

    listNames: ListName[] = [];

    cardSubscription: Subscription;

    listSubscription: Subscription;

    listNameSubscription: Subscription;

    @ViewChild('inputTitle') inputTitle!: ElementRef;

    @ViewChild('inputTaskListTitle') inputTaskListTitle!: ElementRef;

    status: any = [
        { name: 'New' },
        { name: 'Meeting' },
        { name: 'scheduled' },
        { name: 'In-discussion' },
        { name: 'Quote Sent' },
        { name: 'Quote accepted' },
        { name: 'Project started' },
        { name: 'Cancelled' }
    ];

    winProbablity: any = [
        { name: 'High' },
        { name: 'Medium' },
        { name: 'Low' }
    ];

    sourceList: any = [
        { name: 'Referal' },
        { name: 'Social Media' },
        { name: 'Company website' },
        { name: 'Marketing Efforts' }
    ];

    quantity: any = [
        { type: 'Forestry and Logging', quantity: 0.5, subType: 'Forestry' },
        { type: 'Forestry and Logging', quantity: 1.5, subType: 'Hard Coal Mining' },
        { type: 'Forestry and Logging', quantity: 2.5, subType: 'Brown Coal Mining' },
        { type: 'Coal Mining', quantity: 3.5, subType: 'Forestry' },
        { type: 'Coal Mining', quantity: 4.5, subType: 'Hard Coal Mining' },
        { type: 'Coal Mining', quantity: 5.5, subType: 'Brown Coal Mining' },
    ];
    dynamicInputs: any = [];
    total = 0;
    vat = 17;
    discount = 0;

    serviceIn = {
        facility: '',
        service: '',
        unitRate: 0,
        quantity: 0,
        employeeCount: 0,
        total: 0,
    };

    dealForm = new FormGroup({
        dealName: new FormControl(),
        org: new FormControl(),
        status: new FormControl(),
        customerContact: new FormControl(),
        winProbablity: new FormControl(),
        accountManager: new FormControl(),
        startDate: new FormControl(),
        source: new FormControl(),
        closeDate: new FormControl(),
    });
    individualSubscription: Subscription = new Subscription;
    individualsData: { name: string; id: any; }[] = [];
    organizationSubscription: Subscription = new Subscription;
    templateSubscription: Subscription = new Subscription;
    organizationData: { name: any; id: any; }[] = [];
    selectedOrganization: any = { facilities: [], services: [] };
    organizationFilterData: { name: string; id: any; }[] = [];
    showQuote: boolean = false;
    showTableView: boolean = true;
    paymentValue: any;
    showPaymentsTable: boolean = false;

    columns: any = [
        { header : 'Quote Created Date', field: 'createdDate'},
        { header : 'Quote Value', field: 'value'},
        { header : 'Status', field: 'status'},
        { header : 'Actions', field: 'action'},
    ];
    paymentColumns: any = [
        {header : 'Milestone Date', field: 'milestoneDate'},
        {header : 'Milestone Criteria', field: 'milestoneCriteria'},
        {header : 'Percentage', field: 'percentage'},
        {header : 'Amount', field: 'amount'},
        {header : 'Actions', field: 'action'},
    ];
    tableData: any = [
        { createdDate: 'January 16th 2024', value: '1622', status: 'meeting' }
    ];
    paymentData: any = [];
    loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        public parent: DealsComponent,
        private memberService: MemberService,
        private organizationService: OrganizationService,
        private individualService: IndividualService,
        private kanbanService: KanbanService,
        private dealService: DealService
    ) {
        this.memberService.getMembers().then(members => this.assignees = members);

        this.cardSubscription = this.kanbanService.selectedCard$.subscribe(data => {
            this.card = data;
            this.formValue = { ...data };

        });
        this.listSubscription = this.kanbanService.selectedListId$.subscribe(data => this.listId = data);
        this.listNameSubscription = this.kanbanService.listNames$.subscribe(data => this.listNames = data);
    }
    ngOnInit() {
        this.organizationService.getAllOrganization();
        this.individualService.getAllIndividuals();
        this.subscribeToGetAllOrganization();
        this.subscribeToGetAllIndividuals();
        this.addNewService();
        this.subscribeToSavedTemplate();
    }
    changeOrg(event: any) {
        this.selectedOrganization = _.find(this.organizationData, (org) => org.id == event.value);
    }
    subscribeToGetAllOrganization() {
        this.organizationSubscription = this.organizationService.allOrganization.subscribe(
            (res: any) => {
                this.organizationData = res.results;
                this.organizationFilterData = _.map(res.results, (i) => {
                    return { name: i.primaryDetails.name, id: i.id }
                });
            });
    }
    subscribeToGetAllIndividuals() {
        this.individualSubscription = this.individualService.allIndividuals.subscribe(
            (res: any) => {
                this.individualsData = _.map(res.results, (i) => {
                    return { name: `${i.personalDetails.firstName} ${i.personalDetails.middleName} ${i.personalDetails.lastName}`, id: i.id }
                });
            }
        );
    }
    subscribeToSavedTemplate() {
        this.templateSubscription = this.dealService.dealAsPdf.subscribe(
            (res: any) => {
                console.log(res);
            }
        );
    }
    addNewService() {
        this.dynamicInputs.push(_.cloneDeep(this.serviceIn));
    }
    subscribeToGetAllDealaddedits() {

    }

    duplicateData(event: any) {
        this.tableData.push(event.data[0]);
    }
    saveQuote() {
        this.showQuote = false;
        this.showTableView = true;
        let result = this.dealForm.value;
        // console.log(this.dealForm.value);
        // console.log(this.total);
        // console.log(this.vat);
        // console.log(this.discount);
        // console.log(this.total * (this.vat/100));
        // console.log(this.getFinalTotal());
        this.tableData.push({
            createdDate: moment(result.startDate).format('MMMM Do YYYY'),
            status: result.status.name,
            value : this.getFinalTotal()
        });
    }
    createPaymentMilestone() {
        this.showPaymentsTable = true;
        const result = (this.getFinalTotal()/this.paymentValue);
        console.log(result);
        let i;
        for(i=0; i<this.paymentValue; i++) {
            const obj = {
                milestoneDate : '16th Jan 2024',
                milestoneCriteria: '',
                percentage: (100/this.paymentValue).toFixed(2),
                amount: result.toFixed(2)
            }
            this.paymentData.push(obj);
        }
    }
    editPaymentTable(event: any) {
        let resultPer: any;
        if(event.data) {
            if(event.field === 'field') {
                resultPer = (100 - parseInt(event.data))/(parseInt(this.paymentValue)-1);
            }
            console.log(resultPer);
            // _.forEach(this.paymentData, (obj) => {
            //     if(obj.percentage !== parseInt(event.data)) {
            //         obj.percentage = resultPer;
            //     }
            // });
            // this.paymentData = [...this.paymentData];
        }
    }

    onValueChange(index: number) {
        if (this.dynamicInputs[index].facility && this.dynamicInputs[index].service) {
            this.dynamicInputs[index].employeeCount = this.dynamicInputs[index].facility.employeeCount;
            this.dynamicInputs[index].unitRate = this.dynamicInputs[index].service.amount;
            const hours = _.find(this.quantity, (q: any) => q.type == this.selectedOrganization.segmant.industryType && q.subType == this.selectedOrganization.segmant.subType);
            this.dynamicInputs[index].quantity = hours.quantity;
            this.dynamicInputs[index].total = this.dynamicInputs[index].employeeCount * this.dynamicInputs[index].unitRate * this.dynamicInputs[index].quantity;

            this.getFinalTotal();
        }
    }
    subscribeToAddDealaddedits() {

    }

    subscribeToUpdateDealaddedits() {

    }
    getFinalTotal() {
        if (this.dynamicInputs && this.dynamicInputs.length > 0) {
            this.total = 0;
            _.each(this.dynamicInputs, (data) => {
                this.total += data.total;
            });
        }
        if (this.total) { return Math.round(this.total * (this.vat / 100) + this.total) - this.discount }
        return 0;
    }
    addContact() {
    }

    showContent() {
    }

    clearDetails() {
    }

    onSubmit() {

    }

    quoteView() {
        this.showQuote = !this.showQuote;
        this.showTableView = (this.showQuote) ? false : true;
    }

    showDetailsView(event: any) {
        console.log(event);
        this.showTableView = false;
        this.showQuote = true;
    }

    generatePdf() {
        console.log(this.dealForm.value);
        console.log(this.total);
        console.log(this.vat);
        console.log(this.discount);
        console.log(this.total * (this.vat/100));
        console.log(this.getFinalTotal());
        // this.dealService.saveDealAsPdf(this.dealForm.value);
        this.dealService.saveDealAsPdf({
            "logo": "https://expert-pm.de/wp-content/uploads/2018/09/Logo_frei_rot-e1537278645189.png",
            "name": "Reif Baugeseilschaft mbH & Co. KG",
            "address1": "Schmale Straße 14",
            "address2": "04435 Schkeuditz rechnung",           
            "ourSign":"JW/MS",
            "project":"179/23/9089",
            "invoiceNumber":"23/0997",
            "customerNumber":"11800",
            "date":"01.14.2024",
            "subject":"Rechnung",
            "email":"rechnungenreif-leipzig.de",
            "salutation":"Sehr geehrte Damen und Herren",
            "servicePeriod":"Oktober bis Dezember 2023",
            "tee": this.total.toString(),
            "vatText": `${this.vat}% MwStauf ${this.total}`,
            "vatAmount":"752,40",
            "totalAmount":this.getFinalTotal().toString(),
            "creditInstitution":"Commerzbank Dresden",
            "iban":"DE48 850800000103331100",
            "bic":"DRESDEFF 850",
            "signedBy":"Janette Wolf",
            "signedByNote":"Leite.rjn, hnungswesen"
        });
    }

    ngOnDestroy() {
        this.cardSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
        this.listNameSubscription.unsubscribe();
        this.templateSubscription.unsubscribe();
        clearTimeout(this.timeout);
    }

    close() {
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    filterAssignees(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.assignees.length; i++) {
            let assignee = this.assignees[i];
            if (assignee.name && assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(assignee);
            }
        }

        this.filteredAssignees = filtered;
    }

    onComment(event: Event) {
        event.preventDefault();
        if (this.comment.trim().length > 0) {
            this.newComment = { ...this.newComment, text: this.comment }
            this.formValue?.comments?.unshift(this.newComment);
            this.comment = '';
        }
    }

    onSave(event: any) {
        event.preventDefault();
        this.card = { ...this.formValue };
        this.kanbanService.updateCard(this.card, this.listId);
        this.close();
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.formValue, listId, this.listId);
    }

    onDelete() {
        this.kanbanService.deleteCard(this.formValue?.id || '', this.listId);
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    resetForm() {
        this.formValue = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };
    }

    addTaskList() {
        this.showTaskContainer = !this.showTaskContainer;

        if (!this.showTaskContainer) {
            return;
        }
        else if (!this.formValue.taskList) {
            let id = this.kanbanService.generateId();
            this.formValue = { ...this.formValue, taskList: { id: id, title: 'Untitled Task List', tasks: [] } };
        }
    }

    addTask(event: Event) {
        event.preventDefault();
        if (this.taskContent.trim().length > 0) {
            this.newTask = { text: this.taskContent, completed: false };
            this.formValue.taskList?.tasks.unshift(this.newTask);
            this.taskContent = '';
            this.calculateProgress();
        }
    }

    focus(arg: number) {
        if (arg == 1) {
            this.timeout = setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
        }
        if (arg == 2) {
            this.timeout = setTimeout(() => this.inputTaskListTitle.nativeElement.focus(), 1);
        }
    }

    calculateProgress() {
        if (this.formValue.taskList) {
            let completed = this.formValue.taskList.tasks.filter(t => t.completed).length;
            this.formValue.progress = Math.round(100 * (completed / this.formValue.taskList.tasks.length));
        }
    }

}
