import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/shared/store/app.state';
import { FormInfo } from 'src/app/shared/models/formInfo.model';
import * as AppActions from '../../shared/store/app.actions';
import * as Selectors from '../../shared/store/app.selectors';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Selectable } from 'src/app/shared/models/selectable.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  faPenToSquare = faPenToSquare;
  storeSubscription: Subscription;
  allFormsInfo: FormInfo[] = [];
  allForms: Selectable[] = [];

  constructor(private store: Store<AppState>) {
    store.dispatch(new AppActions.GetFormsInfoStart());
    this.storeSubscription = this.store.select(Selectors.allFormsInfo).subscribe((forms: FormInfo[]) => {
      this.allFormsInfo = [...forms];
      this.allFormsInfo.forEach((formInfo: FormInfo) => {
        const form = new Selectable(formInfo);
        this.allForms.push(form);
      })
    });
  }

  ngOnInit(): void {
  }

  onEdit(id?: string){
    if(id){
      const thisFormInfo: FormInfo = this.allFormsInfo.filter(form => form.id === id)[0];
      // Open modal and send in thisFormInfo
    }
  }

  onDelete(){
    const selectedForms: Selectable[] = this.allForms.filter(form => form.isSelected);
    selectedForms.forEach(form => {
      const formId = form.id;
      //this.store.dispatch(new AppActions.DeleteFormStart());
    })
  }

  isThisChecked(id?: string) : boolean | undefined {
    if(id){
      return this.allForms.find((form: Selectable) => form.id === id)?.isSelected;
    } else {
      return false;
    }
  }

  areAllChecked() : boolean {
    return this.allForms.length > 0 && 
            !(this.allForms.some(form => !form.isSelected));
  }

  toggleSelectThis(event: Event, id?: string){
    let isChecked = (event.target as HTMLInputElement).checked;
    let form = this.allForms.find((form: Selectable) => form.id === id);
    if(form){  
      if(isChecked){
        form.isSelected = true;
      } else {
        form.isSelected = false; 
      }    
    }
  }

  toggleSelectAll(event: Event){
    let isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.allForms.forEach((form: Selectable) => {
        form.isSelected = true;
      });
    } else {
      this.allForms.forEach((form: Selectable) => {
        form.isSelected = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}
