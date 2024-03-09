import { Component, OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
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
import { dealStatus } from '../deals.helper';
import { REMOVEIDS } from 'src/app/coreModules/common.function';
import { KeycloakService } from 'keycloak-angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { XService } from 'src/app/api/x/x.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getpdfTemplate } from './kanban-sidebar.helper';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
    selector: 'app-kanban-sidebar',
    templateUrl: './kanban-sidebar.component.html',
    styleUrls: ['./kanban-sidebar.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class KanbanSidebarComponent implements OnDestroy {

    card: KanbanCard = { id: '', startDate: '', closeDate: '', taskList: { title: 'Untitled Task List', tasks: [] } };

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

    status: any = _.cloneDeep(dealStatus);

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
    paymentMilestone = [
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.ANNUAL'), value: 1 },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.SEMI_ANNUAL'), value: 2 },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.QUARTERLY'), value: 4 },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.MONTHLY'), value: 12 }
    ];
    showPaymentsTable: boolean = false;
    accountManagerList: { name: string; id: any; }[] = [];
    allIndividualsList: any;

    paymentData: any = [];
    loading: boolean = false;
    quoteVisible: boolean = false;
    selectedQuote: any;
    langChangeSubscription!: Subscription;

    // LanguageMapper 
    languageMapper: any = {
        "Manufacturing Plant": "Produktionsstätte",
        "Office": "Büro",
        "Warehouse": "Lager",
        "Remote": "Remote",
        "Basic Care": "Grundversorgung",
        "External Audit": "Externe Prüfung",
        "Internal Audit": "Interne Anhörung",
        "Special Care": "Spezialbehandlung"
    }
    quoteTypes = [
        {
            label: 'Time and Material',
            value: 'time'
        },
        {
            label: 'Fixed Price',
            value: 'fixed'
        },
        {
            label: 'Ala Carte',
            value: 'clacarte'
        }
    ]
    quoteItems: any;
    allServices: any = [];
    filteredServices: any = [];
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        public parent: DealsComponent,
        private memberService: MemberService,
        private organizationService: OrganizationService,
        private individualService: IndividualService,
        private kanbanService: KanbanService,
        private keycloakService: KeycloakService,
        private changeDetectorRef: ChangeDetectorRef,
        private translate: TranslateService,
        private xService: XService,
        private dealService: DealService
    ) {
        this.quoteItems = [
            {
                name: 'SIFA',
                id: 'SIFA',
            },
            {
                name: 'SiGeKo',
                id: 'SiGeKo',
            },
            {
                name: 'QM',
                id: 'QM',
            }
        ];
        _.each(this.status, (status) => {
            status.label = this.translate.instant(status.label);
        });

        this.cardSubscription = this.kanbanService.selectedCard$.subscribe(data => {
            this.card = _.cloneDeep(data);
            this.formValue = { ...data };
            this.initForm()

        });
        this.listSubscription = this.kanbanService.selectedListId$.subscribe(data => this.listId = data);
        this.listNameSubscription = this.kanbanService.listNames$.subscribe(data => this.listNames = data);
        this.xService.getAllX('serviceList').subscribe(
            (res: any) => {
                this.allServices = res.results;
            }
        )
    }
    ngOnInit() {
        this.organizationService.getAllOrganization();
        this.individualService.getAllIndividuals();
        this.subscribeToGetAllOrganization();
        this.subscribeToGetAllIndividuals();
        this.subscribeToSavedTemplate();
        this.subscribeToLangulaeChange();
    }
    subscribeToLangulaeChange() {
        this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.paymentMilestone = [
                { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.ANNUAL'), value: 1 },
                { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.SEMI_ANNUAL'), value: 2 },
                { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.QUARTERLY'), value: 4 },
                { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.MONTHLY'), value: 12 }
            ];
            this.status = _.cloneDeep(dealStatus);
            _.each(this.status, (status) => {
                status.label = this.translate.instant(status.label)
            })
        });

    }
    canUpdateDeal() {
        return this.keycloakService.isUserInRole('edit-deal');
    }
    initForm() {
        if (!this.dealForm.value.dealName) {
            this.dealForm = this.fb.group({
                dealName: ['', [Validators.required]],
                org: ['', [Validators.required]],
                status: [{ value: 'New', disabled: true }, [Validators.required]],
                customerContact: ['', []],
                winProbablity: ['High', []],
                accountManager: ['', [Validators.required]],
                type: ['', []],
                startDate: [new Date(), [Validators.required]],
                source: ['', []],
                value: ['0', []],
                closeDate: [new Date(new Date().setMonth(new Date().getMonth() + 2)), [Validators.required]],
                quotes: this.fb.array([])
            });
            // this.initQuotesArray();
            this.subscribeFormChanges();
        }
        if (this.card.org) {
            this.card.startDate = new Date(Date.parse(this.card.startDate.toString()));
            this.card.closeDate = new Date(Date.parse(this.card.closeDate.toString()));
            this.card.org = this.card.org.id;
            this.card.accountManager = this.card.accountManager.id;
            this.dealForm.patchValue(this.card);
            const quotesArray = this.dealForm.get('quotes') as FormArray;
            quotesArray.clear();  // Clear existing controls
            this.card.quotes?.forEach((quote: any) => {
                const quoteGroup = this.patchQuoteGroup(quote);
                quotesArray.push(quoteGroup);
            });
            this.changeOrg(this.card.org);
            this.changeType(this.card.type);
        }
    }

    patchQuoteGroup(quote: any) {
        const quoteGroup = this.fb.group({
            date: [new Date(quote.date)],
            status: [{ value: quote.status, disabled: true }],
            subTotal: [{ value: quote.subTotal, disabled: true }],
            vat: [quote.vat],
            type: [quote.type],
            vatValue: [{ value: Math.round((quote.subTotal - quote.discount) * (quote.vat / 100)), disabled: true }],
            discount: [quote.discount],
            total: [{ value: quote.total, disabled: true }],
            paymentMilestone: [quote.paymentMilestone],
            services: this.fb.array([]),
            payments: this.fb.array([])
        });
        quoteGroup.patchValue(quote);
        // Add services to the services FormArray
        const servicesArray = quoteGroup.get('services') as FormArray;
        servicesArray.clear();  // Clear existing controls
        quote.services.forEach((service: any) => {
            service.startDate = new Date(Date.parse(service.startDate.toString()));
            service.endDate = new Date(Date.parse(service.endDate.toString()));
            service.employeeCount = { value: service.employeeCount, disabled: true }
            service.total = { value: service.total, disabled: (quote.type === 'time') ? true : false }
            service.unitRate = { value: service.unitRate, disabled: (quote.type === 'fixed') ? true : false }
            service.quantity = { value: service.quantity, disabled: (quote.type === 'fixed') ? true : false }
            servicesArray.push(this.fb.group(service));
        });

        // Add payments to the payments FormArray
        const paymentsArray = quoteGroup.get('payments') as FormArray;
        paymentsArray.clear();  // Clear existing controls
        quote.payments.forEach((payment: any) => {
            payment.date = new Date(payment.date)
            paymentsArray.push(this.fb.group(payment));
        });
        return quoteGroup;
    }

    subscribeFormChanges() {
        // Subscribe to value changes of org
        this.dealForm.get('org')?.valueChanges.subscribe(newValue => {
            this.changeOrg(newValue);
        });
        this.dealForm.get('type')?.valueChanges.subscribe(newValue => {
            this.changeType(newValue);
        });
    }
    changeOrg(value: any) {
        if (value) {
            this.selectedOrganization = _.find(this.organizationData, (org) => org.id == value) || value;
            if (this.selectedOrganization.primaryDetails.pointofContact && this.selectedOrganization.primaryDetails.pointofContact.length > 0) {
                this.dealForm.get('customerContact')?.setValue(this.selectedOrganization.primaryDetails.pointofContact[0].name);
            }
            // if (this.selectedOrganization.primaryDetails.accountManager && typeof this.selectedOrganization.primaryDetails.accountManager === 'string') {
            //     this.dealForm.get('accountManager')?.setValue(this.selectedOrganization.primaryDetails.accountManager);
            // }
            _.each(this.selectedOrganization.facilities, (facility) => {
                facility.name = `${this.languageMapper[facility.type]}${(facility.address) ? ` - ${facility.address}` : ''}`;
            });
            this.selectedOrganization.facilities.push({ name: 'Remote', _id: 'Remote', type: 'Remote' });
            this.selectedOrganization.facilities = _.uniqBy(this.selectedOrganization.facilities, 'name');
        }
    }
    changeType(value: any) {
        this.filteredServices = _.filter(this.allServices, (service) => service.type == value);
    }
    changeQuoteType(quoteFormIndex: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        servicesArray.clear();  // Clear existing controls
        this.getFinalTotal(quoteFormIndex);
    }
    // Helper methods to initialize form arrays
    initQuotesArray(type = ''): void {
        if (this.dealForm.get('status')?.value === 'New') { this.dealForm.get('status')?.setValue('Quote-In-Progress') }
        this.QuotesArray.insert(0, this.fb.group({
            date: [new Date(), [Validators.required]],
            status: ['New', [Validators.required]],
            subTotal: [{ value: '0', disabled: true }, [Validators.required]],
            vat: [19, [Validators.required]],
            type: [type, [Validators.required]],
            vatValue: [{ value: '0', disabled: true }, []],
            discount: ['0', [Validators.required]],
            total: [{ value: '0', disabled: true }, [Validators.required]],
            paymentMilestone: [0, []],
            services: this.fb.array([]),
            payments: this.fb.array([])
        }));
    }
    cloneQuote(event: Event, quoteFormIndex: number) {
        event.stopPropagation();
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        this.QuotesArray.insert(0, this.patchQuoteGroup(quotesFormGroup.getRawValue()))
    }
    deleteQuote(event: Event, quoteFormIndex: number) {
        // this.QuotesArray.controls.splice(quoteFormIndex,1);
    }
    get QuotesArray(): FormArray {
        return this.dealForm.get('quotes') as FormArray;
    }
    getServiceArray(quoteFormIndex: number): FormArray {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        return servicesArray;
    }
    getPaymentArray(quoteFormIndex: number): FormArray {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const paymentsArray = quotesFormGroup.get('payments') as FormArray;
        return paymentsArray;
    }
    // Helper methods to initialize form arrays
    initServicesArray(quoteFormIndex: any): void {
        this.getServiceArray(quoteFormIndex).push(this.fb.group({
            startDate: [new Date()],
            endDate: [new Date()],
            facility: ['', [Validators.required]],
            service: ['', [Validators.required]],
            description: [''],
            unitRate: [{ value: 0, disabled: (this.QuotesArray.at(quoteFormIndex).get('type')?.value === 'fixed') ? true : false }, []],
            quantity: [{ value: 0, disabled: (this.QuotesArray.at(quoteFormIndex).get('type')?.value === 'fixed') ? true : false }, []],
            employeeCount: [{ value: '0', disabled: true }, []],
            total: [{ value: 0, disabled: (this.QuotesArray.at(quoteFormIndex).get('type')?.value === 'time') ? true : false }, [Validators.required]],
            disabled: []
        }));
    }

    createPaymentMilestone(quoteFormIndex: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const paymentMilestone = +quotesFormGroup.get('paymentMilestone')?.value;
        if (paymentMilestone) {
            const result = (this.getDealFinalAmount() / paymentMilestone);
            const monthIncrement = Math.round(12 / paymentMilestone);
            this.getPaymentArray(quoteFormIndex).clear();  // Clear existing controls
            for (let i = 0; i < paymentMilestone; i++) {
                this.getPaymentArray(quoteFormIndex).push(this.fb.group({
                    date: [new Date(new Date().setMonth(new Date().getMonth() + (monthIncrement * (i + 1)))), [Validators.required]],
                    criteria: ['Payment ' + (i + 1), []],
                    percentage: [(100 / paymentMilestone).toFixed(2), [Validators.required]],
                    amount: [result.toFixed(2), [Validators.required]],
                    status: ['New', [Validators.required]],
                }));
            }
        } else {
            this.getPaymentArray(quoteFormIndex).push(this.fb.group({
                date: [new Date(), [Validators.required]],
                criteria: ['', []],
                percentage: ['', [Validators.required]],
                amount: ['', [Validators.required]],
                status: ['', [Validators.required]],
            }));
        }

    }
    validatePayment(quoteFormIndex: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteFormIndex) as FormGroup;
        const payments = this.getPaymentArray(quoteFormIndex).value;
        let percentage = 0;
        let amount = 0;
        _.each(payments, (payment) => {
            percentage += +payment.percentage;
            amount += +payment.amount;
        });
        if (percentage === 100 && amount === this.getDealFinalAmount()) {
            return true;
        } else {
            return false;
        }
    }

    calculateHours(data: any) {
        if (data) {
            return (data.subType2.Name) ? data.subType2.Hours : (data.subType1.Name) ? data.subType1.Hours : (data.industryType.Name) ? data.industryType.Hours : 0
        } else {
            return 0;
        }
    }

    removeService(quoteIndex: number, index: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        servicesArray.removeAt(index);
        this.getFinalTotal(quoteIndex);
    }

    onServiceChange(quoteIndex: number, index: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        const servicesFormGroup = servicesArray.at(index) as FormGroup;
        if (servicesFormGroup.get('facility')?.value && servicesFormGroup.get('service')?.value) {
            const service = servicesFormGroup.get('service')?.value;
            const facility = _.find(this.selectedOrganization.facilities, (facility) => facility._id === servicesFormGroup.get('facility')?.value);
            let actualHours = 1;
            if (this.dealForm.get('type')?.value === 'SIFA') {
                const hours: any = this.calculateHours(this.selectedOrganization.primaryDetails) || 1;
                const employeeCount = +facility?.employeeCount || 95;
                actualHours = Math.round(hours * employeeCount * .8);
            }
            servicesFormGroup.patchValue({
                unitRate: +service?.rate || 0,
                quantity: actualHours,
                total: Math.round(actualHours * service?.rate || 0)
            });
            this.getFinalTotal(quoteIndex);
        }
    }
    onServiceCountChange(quoteIndex: number, index: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const servicesArray = quotesFormGroup.get('services') as FormArray;
        const servicesFormGroup = servicesArray.at(index) as FormGroup;
        const total = (+servicesFormGroup.get('quantity')?.value) * (+servicesFormGroup.get('unitRate')?.value)
        servicesFormGroup.patchValue({ total: total });
        this.getFinalTotal(quoteIndex);
    }
    onPaymentPercentageChange(quoteIndex: number, index: number) {
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const paymentsArray = quotesFormGroup.get('payments') as FormArray;
        const paymentsFormGroup = paymentsArray.at(index) as FormGroup;
        const total = this.getDealFinalAmount();
        const percentage = paymentsFormGroup.get('percentage')?.value;
        paymentsFormGroup.patchValue({ amount: Math.round((percentage / 100) * total) });
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
        quotesFormGroup.patchValue({ subTotal: total });
        const vatValue = this.getVatValue(quoteIndex);
        const discount = +quotesFormGroup.get('discount')?.value;
        finalAmount = (total - discount) + vatValue;
        quotesFormGroup.patchValue({ total: finalAmount });
        this.dealForm.get('value')?.setValue(finalAmount)
    }

    getVatValue(quoteIndex: number) {
        let result = 0;
        const quotesFormGroup = this.QuotesArray.at(quoteIndex) as FormGroup;
        const vat = +quotesFormGroup.get('vat')?.value;
        const total = +quotesFormGroup.get('subTotal')?.value;
        const discount = +quotesFormGroup.get('discount')?.value;
        if (total) {
            result = Math.round((total - discount) * (vat / 100));
            quotesFormGroup.patchValue({ vatValue: result });
        }
        return result;
    }
    customFacilityLabel(option: any): string {
        return `${option.type} - ${option.address}`;
    }

    getDealFinalAmount() {
        return Number(this.dealForm.get('value')?.value);
    }
    subscribeToGetAllOrganization() {
        this.organizationSubscription = this.organizationService.allOrganization.subscribe(
            (res: any) => {
                this.organizationData = res.results;
                this.organizationFilterData = _.sortBy(_.map(res.results, (i) => {
                    return { name: i.primaryDetails.name, id: i.id }
                }), item => item.name.toLowerCase());
            });
    }
    subscribeToGetAllIndividuals() {
        this.individualSubscription = this.individualService.allIndividuals.subscribe(
            (res: any) => {
                const accountManagers: any = _.filter(res.results, (obj) => obj.primaryDetails.jobTitle === 'Account Manager' && obj.primaryDetails.companyName === 'Expert People Management GmbH');
                this.accountManagerList = _.sortBy(_.map(accountManagers, (i) => {
                    return { name: `${i.primaryDetails.firstName} ${i.primaryDetails.lastName}`, id: i.id, company: i.primaryDetails.companyName }
                }), 'name');
                this.individualsData = _.map(res.results, (i) => {
                    return { name: `${i.primaryDetails.firstName} ${i.primaryDetails.lastName}`, id: i.id, company: i.primaryDetails.companyName }
                });
                this.allIndividualsList = _.cloneDeep(this.individualsData);
            }
        );
    }
    subscribeToSavedTemplate() {
        this.templateSubscription = this.dealService.dealAsPdf.subscribe(
            (res: any) => {
            }
        );
    }
    subscribeToGetAllDealaddedits() {

    }

    duplicateData(event: any) {

    }

    updateCustomerContact(event: any) {
        const result: any = _.filter(this.organizationFilterData, (obj) => obj.id == event.value);
        if (result.length > 0) {
            this.individualsData = _.filter(this.allIndividualsList, (obj: any) => obj.company === result[0].name);
        }
    }
    reviewQuote(event: Event) {
        event.preventDefault();
        this.dealForm.get('status')?.setValue('Quote Review');
        this.saveQuote(event);
    }
    updateEmailSent() {
        this.dealForm.get('status')?.setValue('Offer Sent');
        this.dealService.updateDeal(this.dealForm.getRawValue(), this.card.id);
    }
    saveQuote(event: Event) {
        event.preventDefault();
        this.showQuote = false;
        this.showTableView = true;
        if (this.card.org) {
            this.dealService.updateDeal(this.dealForm.getRawValue(), this.card.id);
        } else {
            this.dealService.postDeal(this.dealForm.getRawValue());
        }
        this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.DEALS_SAVED') });
        this.card = { ...this.dealForm.getRawValue() };
        this.kanbanService.updateCard(this.card, this.listId);
        this.close(event);
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

    ngOnDestroy() {
        this.cardSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
        this.listNameSubscription.unsubscribe();
        this.templateSubscription.unsubscribe();
        clearTimeout(this.timeout);
    }

    close(event: any) {
        event.preventDefault();
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

    documentPreview(event: Event, i: number) {
        // this.quoteVisible = false;
        this.changeDetectorRef.detectChanges();
        this.selectedQuote = this.dealForm.getRawValue().quotes[i];
        console.log(pdfMake)
        pdfMake.createPdf(getpdfTemplate(this.dealForm.getRawValue().type)).open();
        // this.quoteVisible = true;
    }


    onSave(event: any) {
        event.preventDefault();
        this.card = { ...this.formValue };
        this.kanbanService.updateCard(this.card, this.listId);
        this.close(event);
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.dealForm.value, listId, this.listId);
    }

    onDelete() {
        this.kanbanService.deleteCard(this.formValue?.id || '', this.listId);
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    resetForm() {
        this.dealForm.reset();
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
