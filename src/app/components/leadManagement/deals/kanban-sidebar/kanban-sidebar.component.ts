import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { KanbanCard, Comment, ListName, Task } from 'src/app/api/kanban';
import { Member } from 'src/app/api/member';
import { MemberService } from 'src/app/service/member.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { KanbanService } from '../service/kanban.service';
import { DealsComponent } from '../deals.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    quotes: FormArray = this.fb.array([]);
    services: FormArray = this.fb.array([]);
    payments: FormArray = this.fb.array([]);
    dealForm: FormGroup = new FormGroup({});
    individualSubscription: Subscription = new Subscription;
    individualsData: { name: string; id: any; }[] = [];
    organizationSubscription: Subscription = new Subscription;
    templateSubscription: Subscription = new Subscription;
    organizationData: { name: any; id: any; }[] = [];
    selectedOrganization: any = { facilities: [], services: [] };
    organizationFilterData: { name: string; id: any; }[] = [];
    showQuote: boolean = false;
    showTableView: boolean = false;
    paymentMilestone: any;
    showPaymentsTable: boolean = false;

    columns: any = [
        { header: 'Quote Created Date', field: 'createdDate' },
        { header: 'Quote Value', field: 'value' },
        { header: 'Status', field: 'status' },
        { header: 'Actions', field: 'action' },
    ];
    paymentColumns: any = [
        { header: 'Milestone Date', field: 'milestoneDate' },
        { header: 'Milestone Criteria', field: 'milestoneCriteria' },
        { header: 'Percentage', field: 'percentage' },
        { header: 'Amount', field: 'amount' },
        { header: 'Actions', field: 'action' },
    ];
    tableData: any = [];
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
        this.subscribeToSavedTemplate();
        this.dealForm = this.fb.group({
            dealName: ['', [Validators.required]],
            org: ['', [Validators.required]],
            status: ['New', [Validators.required]],
            customerContact: ['', [Validators.required]],
            winProbablity: ['', [Validators.required]],
            accountManager: ['', [Validators.required]],
            startDate: [new Date(), [Validators.required]],
            source: ['', []],
            value: ['0', [Validators.required]],
            closeDate: [new Date(), [Validators.required]],
            quotes: this.quotes
        });
        this.initQuotesArray();
        this.subscribeFormChanges();
    }
    subscribeFormChanges() {
        // Subscribe to value changes of org
        this.dealForm.get('org')?.valueChanges.subscribe(newValue => {
            this.changeOrg(newValue);
        });
    }
    changeOrg(value: any) {
        this.selectedOrganization = _.find(this.organizationData, (org) => org.id == value);
        this.dealForm.get('customerContact')?.setValue(this.selectedOrganization.primaryDetails.pointofContact);
        this.dealForm.get('accountManager')?.setValue(this.selectedOrganization.primaryDetails.accountManager);
    }
    // Helper methods to initialize form arrays
    initQuotesArray(): void {
        const QuotesArray = this.dealForm.get('quotes') as FormArray;
        QuotesArray.push(this.fb.group({
            date: [new Date(), [Validators.required]],
            status: ['New', [Validators.required]],
            subTotal: ['0', [Validators.required]],
            vat: ['18', [Validators.required]],
            discount: ['0', [Validators.required]],
            total: ['0', [Validators.required]],
            paymentMilestone: ['0', []],
            services: this.services,
            payments: this.payments
        }));
        this.initServicesArray(QuotesArray.length - 1);
    }
    get QuotesArray(): FormArray {
        return this.dealForm.get('quotes') as FormArray;
    }
    // Helper methods to initialize form arrays
    initServicesArray(quoteFormIndex: any): void {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        servicesArray.push(this.fb.group({
            facility: ['', [Validators.required]],
            service: ['', [Validators.required]],
            unitRate: ['0', [Validators.required]],
            quantity: ['0', [Validators.required]],
            employeeCount: ['0', [Validators.required]],
            total: ['0', [Validators.required]],
        }));
    }
    createPaymentMilestone(quoteFormIndex: number) {
        this.showPaymentsTable = true;
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const paymentsArray = quotesFormGroup.get('payments') as FormArray;
        const paymentMilestone = +quotesFormGroup.get('paymentMilestone')?.value;
        const result = (this.getDealFinalAmount() / paymentMilestone);
        for (let i = 0; i < paymentMilestone; i++) {
            paymentsArray.push(this.fb.group({
                date: [new Date(), [Validators.required]],
                criteria: ['Auto payment generation', []],
                percentage: [(100 / paymentMilestone).toFixed(2), [Validators.required]],
                amount: [result.toFixed(2), [Validators.required]],
                status: ['New', [Validators.required]],
            }));
            const obj = {
                milestoneDate: '19th Jan 2024',
                milestoneCriteria: 'Auto payment generation',
                percentage: (100 / paymentMilestone).toFixed(2),
                amount: result.toFixed(2)
            }
            this.paymentData.push(obj);
        }
    }
    onServiceChange(quoteIndex: number, index: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        const servicesFormGroup = servicesArray.at(index) as FormGroup;
        if (servicesFormGroup.get('facility')?.value && servicesFormGroup.get('service')?.value) {
            const service = _.find(this.selectedOrganization.services, (service) => service._id === servicesFormGroup.get('service')?.value);
            const facility = _.find(this.selectedOrganization.facilities, (facility) => facility._id === servicesFormGroup.get('facility')?.value);
            const hours = _.find(this.quantity, (q: any) => q.type == this.selectedOrganization.segmant.industryType && q.subType == this.selectedOrganization.segmant.subType);
            servicesFormGroup.patchValue({
                employeeCount: facility.employeeCount,
                unitRate: service.amount,
                quantity: hours.quantity,
                total: Math.round(facility.employeeCount * service.amount * hours.quantity)
            });
            this.getFinalTotal(quoteIndex);
        }
    }
    getFinalTotal(quoteIndex: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        let total = 0;
        let finalAmount = 0;
        for (let i = 0; i < servicesArray.length; i++) {
            const servicesFormGroup = servicesArray.at(i) as FormGroup;
            total += +servicesFormGroup.get('total')?.value;
        }
        if (total) {
            const vat = +quotesFormGroup.get('vat')?.value;
            const discount = +quotesFormGroup.get('discount')?.value;
            finalAmount = Math.round(((total * (vat / 100)) + total) - discount)
            quotesFormGroup.patchValue({
                subTotal: total,
                total: finalAmount
            });
            this.dealForm.get('value')?.setValue(finalAmount)
        }
    }
    getDealFinalAmount() {
        return Number(this.dealForm.get('value')?.value);
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
    subscribeToGetAllDealaddedits() {

    }
    saveQuote() {
        this.showQuote = false;
        this.showTableView = true;
        let result = this.dealForm.value;
        console.log(result);
        this.tableData.push({
            createdDate: moment(result.startDate).format('MMMM Do YYYY'),
            status: result.status.name,
            value: this.getDealFinalAmount()
        });
    }

    subscribeToAddDealaddedits() {

    }

    subscribeToUpdateDealaddedits() {

    }
    addContact() {
    }

    showContent() {
    }

    clearDetails() {
    }

    onSubmit() {

    }

    generatePdf() {
        // this.dealService.saveDealAsPdf(this.dealForm.value);
        this.dealService.saveDealAsPdf({
            "logo": "https://expert-pm.de/wp-content/uploads/2018/09/Logo_frei_rot-e1537278645189.png",
            "name": "Reif Baugeseilschaft mbH & Co. KG",
            "address1": "Schmale Straße 14",
            "address2": "04435 Schkeuditz rechnung",
            "ourSign": "JW/MS",
            "project": "179/23/9089",
            "invoiceNumber": "23/0997",
            "customerNumber": "11800",
            "date": "01.14.2024",
            "subject": "Rechnung",
            "email": "rechnungenreif-leipzig.de",
            "salutation": "Sehr geehrte Damen und Herren",
            "servicePeriod": "Oktober bis Dezember 2023",
            "tee": '',
            "vatText": '',
            "vatAmount": "752,40",
            "totalAmount": this.getDealFinalAmount().toString(),
            "creditInstitution": "Commerzbank Dresden",
            "iban": "DE48 850800000103331100",
            "bic": "DRESDEFF 850",
            "signedBy": "Janette Wolf",
            "signedByNote": "Leite.rjn, hnungswesen"
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
