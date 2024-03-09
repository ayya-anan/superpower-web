import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { XService } from 'src/app/api/x/x.service';

@Component({
  selector: 'app-service-settings',
  templateUrl: './service-settings.component.html',
  styleUrl: './service-settings.component.scss'
})
export class ServiceSettingsComponent implements OnInit {

  //Subscriptions
  langChangeSubscription: Subscription = new Subscription;
  deleteService: Subscription = new Subscription;

  //DropDowns
  // ServiceTypes: any = [
  //   { label: this.translate.instant('DROPDOWNS.SIFA'), name: 'SIFA' },
  //   { label: this.translate.instant('DROPDOWNS.QM'), name: 'QM' },
  //   { label: this.translate.instant('DROPDOWNS.SiGeKo'), name: 'SiGeKo' },
  // ];
  // subTypeList: any = [];
  // serviceList_SIFA: any = [
  //   { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care' },
  //   { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care' }
  // ];
  // serviceList_QM: any = [
  //   { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit' },
  //   { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit' },
  // ];
  unitMeasure: any = [
    { label: this.translate.instant('DROPDOWNS.DAILY'), name: 'Daily' },
    { label: this.translate.instant('DROPDOWNS.HOURLY'), name: 'Hourly' },
  ]
  
  ServiceTypes: any = [];
  subTypeList: any = [];

  //TableDatas
  loading: boolean = false;
  columns = [
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.SERVICE_TYPE', field: 'type' },
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.SERVICE_SUBTYPE', field: 'subtype' },
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.UNIT_MEASURE', field: 'measure' },
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.UNIT_RATE', field: 'rate' },
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.VALID_TILL', field: 'validTill' },
    { header: 'BUSINESS_ADMINISTRATION.SERVICE_SETTINGS.TEMPLATE', field: 'template' },
    { header: 'COMMON.ACTIONS', field: 'action' },
  ];
  tableData: any = [];

  //Variables
  serviceListForm: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private xService: XService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToLangulaeChange();
    this.subscribeToServiceList();
    this.subscribeToAddedChange();
    this.subscribeToDeleteService();
  }

  subscribeToLangulaeChange() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // this.ServiceTypes = [
      //   { label: this.translate.instant('DROPDOWNS.SIFA'), name: 'SIFA' },
      //   { label: this.translate.instant('DROPDOWNS.QM'), name: 'QM' },
      //   { label: this.translate.instant('DROPDOWNS.SiGeKo'), name: 'SiGeKo' },
      // ];
      // this.serviceList_SIFA = [
      //   { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care' },
      //   { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care' }
      // ];
      // this.serviceList_QM = [
      //   { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit' },
      //   { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit' },
      // ];
      this.unitMeasure = [
        { label: this.translate.instant('DROPDOWNS.DAILY'), name: 'Daily' },
        { label: this.translate.instant('DROPDOWNS.HOURLY'), name: 'Hourly' },
      ]
    });
  }

  createServiceList(serviceTypes: any) {
    this.ServiceTypes.length = 0;
    _.forEach(serviceTypes, (item) => {
        const obj: any = {
          label : item,
          name: item,
        }
        this.ServiceTypes.push(obj);
    }); 
  }

  subscribeToServiceList() {
    this.xService.getAllX('serviceList').subscribe(
      (res: any) => {
        this.ServiceTypes = [];
        _.forEach(res.results, (item) => {
          item.validTill = moment(item.validTill).format('MMM DD YYYY');
        });
        this.tableData = res.results;
        this.createServiceList(_.uniq(_.map(res.results, 'type')));
      }
    );
  }

  subscribeToAddedChange() {
    this.xService.addx.subscribe(
      (res) => {
        this.subscribeToServiceList();
      }
    )
  }

  subscribeToDeleteService() {
    this.deleteService = this.xService.deletexEmit.subscribe(
      (res: any) => {
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.DELETE_SERVICE') });
        this.subscribeToServiceList();
      }
    );
  }

  initForm() {
    this.serviceListForm = this.fb.group({
      type: '',
      subtype: '',
      measure: '',
      rate: '',
      validTill: ''
    });
  }

  changeSubType(event: any) {
    this.serviceListForm.patchValue({subtype: ''});
    this.subTypeList = [];
    const result = _.uniqBy(_.filter(this.tableData, (obj) => obj.type === event.value.label), 'subtype');
    _.forEach(result, (item) => {
      this.subTypeList.push({ label: item.subtype, name: item.subtype });
    });
  }

  onSubmit() {

  }

  saveServices() {
    const resultSet = this.serviceListForm.value;
    const obj = {
      type: (resultSet.type && resultSet.type.name) ? resultSet.type.name : resultSet.type,
      subtype: (resultSet.subtype && resultSet.subtype.name) ? resultSet.subtype.name : resultSet.subtype,
      measure: (resultSet.measure && resultSet.measure.name) ? resultSet.measure.name : resultSet.measure,
      rate: resultSet.rate,
      validTill: resultSet.validTill,
      template: '-'
    }
    this.serviceListForm.reset();
    this.xService.postX('serviceList', obj);
  }

  deleteServices(event: any) {
    this.xService.deleteX('serviceList', event.rowData.id);
  }

}
