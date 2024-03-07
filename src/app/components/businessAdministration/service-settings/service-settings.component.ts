import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-settings',
  templateUrl: './service-settings.component.html',
  styleUrl: './service-settings.component.scss'
})
export class ServiceSettingsComponent implements OnInit {

  //Subscriptions
  langChangeSubscription: Subscription = new Subscription;

  //DropDowns
  ServiceTypes: any = [
    { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'SIFA' },
    { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'QM' },
    { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'SiGeKo' },
  ];
  subTypeList: any = [];
  serviceList_SIFA: any = [
    { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care' },
    { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care' }
  ];
  serviceList_QM: any = [
    { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit' },
    { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit' },
  ];
  unitMeasure: any = [
    { label: this.translate.instant('DROPDOWNS.DAILY'), name: 'Daily' },
    { label: this.translate.instant('DROPDOWNS.HOURLY'), name: 'Hourly' },
  ]

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
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToLangulaeChange();
  }

  subscribeToLangulaeChange() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ServiceTypes = [
        { label: this.translate.instant('DROPDOWNS.SIFA'), name: 'SIFA' },
        { label: this.translate.instant('DROPDOWNS.QM'), name: 'QM' },
        { label: this.translate.instant('DROPDOWNS.SiGeKo'), name: 'SiGeKo' },
      ];
      this.serviceList_SIFA = [
        { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care' },
        { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care' }
      ];
      this.serviceList_QM = [
        { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit' },
        { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit' },
      ];
      this.unitMeasure = [
        { label: this.translate.instant('DROPDOWNS.DAILY'), name: 'Daily' },
        { label: this.translate.instant('DROPDOWNS.HOURLY'), name: 'Hourly' },
      ]
    });
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
    this.subTypeList = (event.value.name === 'SIFA') ? this.serviceList_SIFA : (event.value.name === 'QM') ? this.serviceList_QM : []
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
      validTill: (resultSet.validTill) ? moment(resultSet.validTill).format('MMM DD YYYY') : '',
      template: '-'
    }
    this.tableData.push(obj);
    this.serviceListForm.reset();
  }

  deleteService(event: any) {
    this.tableData.splice(event.index, 1);
  }

}
