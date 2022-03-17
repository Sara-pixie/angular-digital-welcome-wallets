import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store as NgRxStore } from '@ngrx/store';

import { FormInfo } from 'src/app/shared/models/formInfo.model';
import { Store } from 'src/app/shared/models/store.model';
import { AppState } from 'src/app/shared/store/app.state';
import * as AppActions from '../../shared/store/app.actions';
import * as Selectors from '../../shared/store/app.selectors';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  stores: Observable<Store[]>;
  storesSubscription: Subscription;
  chosenStore: Store | null = null;
  form!: FormGroup;

  constructor(private ngRxStore: NgRxStore<AppState>) { 
    this.ngRxStore.dispatch(new AppActions.GetStoresStart());
    this.stores = ngRxStore.select(Selectors.allStores);
    this.storesSubscription = this.stores.subscribe((stores)=>{
      this.chosenStore = stores[0];
      this.form?.patchValue({
        'store': this.chosenStore
      });
    });
  }

  ngOnInit(): void {
    this.buildForm();

    this.form?.get('store')?.valueChanges.subscribe(() =>{
      this.chosenStore = this.form.get('store')?.value; 
      this.form?.patchValue({
        'storeInfo': {
          'storeAddress': this.chosenStore?.storeAddress,
          'phoneNumber': this.chosenStore?.storePhoneNumber
        }
      });
    })
  }

  buildForm(){
    const currentDate = formatDate(new Date(), 'dd-MM-yyyy', 'en');
    const numberRegEx = "^[0-9]*$";
    this.form = new FormGroup({
      'store': new FormControl(null),
      'storeInfo': new FormGroup({
        'date': new FormControl({value: currentDate, disabled: true}),
        'storeAddress': new FormControl({value: null, disabled: true}),
        'phoneNumber': new FormControl({value: null, disabled: true})
      }),
      'userInfo': new FormGroup({
        'servedBy': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email])
      }),
      'packagePaymentInfo': new FormGroup({
        'btBroadbrend': new FormControl(null, Validators.required),
        'btTvPackage': new FormControl(null, Validators.required),
        'sportPackage': new FormControl(null, Validators.required),
        'monthlyCharge': new FormControl(null, [Validators.required, Validators.pattern(numberRegEx)]),
        'upfrontFee': new FormControl(null, [Validators.required, Validators.pattern(numberRegEx)]),
        'installmentsOfPayment': new FormControl(null, Validators.required),
      }),
      'otherInfo': new FormControl(null, Validators.maxLength(50))
    });
  }

  counter(i: number): number[] {
    return new Array(i);
  }

  onResetForm(){
    this.form.reset();
    this.storesSubscription.add(
      this.ngRxStore.select(Selectors.oneStoreInfo(0))
        .subscribe(store => this.chosenStore = store)
    );
    const currentDate = formatDate(new Date(), 'dd-MM-yyyy', 'en');
    this.form?.patchValue({
      'store': this.chosenStore,
      'storeInfo': {
        'date': currentDate
      }
    });
  }

  onSubmit(){
    const formInfo: FormInfo = {
      storeName: this.form.get('store')?.value.storeName,
      date: this.form.get('storeInfo.date')?.value,
      servedBy: this.form.get('userInfo.servedBy')?.value,
      email: this.form.get('userInfo.email')?.value,
      btBroadbrend: this.form.get('packagePaymentInfo.btBroadbrend')?.value,
      btTvPackage: this.form.get('packagePaymentInfo.btTvPackage')?.value,
      sportPackage: this.form.get('packagePaymentInfo.sportPackage')?.value,
      totalPayment: this.calculateTotalPayment(),
      otherHandyInfo: this.form.get('otherInfo')?.value,
    }
    this.ngRxStore.dispatch(new AppActions.AddFormInfoStart(formInfo));
    this.onResetForm();
  }

  calculateTotalPayment(): number {
    const upfrontFee: number = this.form.get('packagePaymentInfo.upfrontFee')?.value;
    const monthlyCharge: number = this.form.get('packagePaymentInfo.monthlyCharge')?.value;
    const installmentsOfPayment: number = this.form.get('packagePaymentInfo.installmentsOfPayment')?.value;
    const totalPayment: number = +upfrontFee + +(monthlyCharge*installmentsOfPayment);
    return totalPayment;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }
  
  ngOnDestroy(): void {
    this.storesSubscription.unsubscribe();  
  }

}
