import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/shared/store/app.state';
import { FormInfo } from 'src/app/shared/models/formInfo.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  allFormsInfo: Observable<FormInfo[]>;

  constructor(store: Store<AppState>) {
    this.allFormsInfo = store.select('allFormsInfo');
  }

  ngOnInit(): void {
  }

}
