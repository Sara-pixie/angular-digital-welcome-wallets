import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import * as AppActions from './app.actions';
import { Store } from '../models/store.model';
import { FormInfo } from '../models/formInfo.model';
import { Injectable } from '@angular/core';

@Injectable()
export class AppEffects{
    getAllStores = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.GET_STORES_START),
            switchMap(() =>{
                return this.db.list<Store>('STORE').valueChanges()
                    .pipe(
                        map((stores: Store[]) => new AppActions.GetStores(stores)),
                        //catchError(() => new AppActions.GetStoresError())
                    );
            })
        )
    });

    getAllFormsInfo = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.GET_FORMS_INFO_START),
            switchMap(() => {
                this.db.list<FormInfo>('FORM').snapshotChanges()
                    .pipe(tap((result: any) => console.log(result)));
                return this.db.list<FormInfo>('FORM').valueChanges()
                    .pipe(
                        map((formsInfo: FormInfo[]) =>  new AppActions.GetFormsInfo(formsInfo)),
                        //catchError(() => new AppActions.GetFormsInfoError())
                    );
            })
        )
    });

    addFormInfo = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.ADD_FORM_INFO_START),
            map((newFormInfo: AppActions.AddFormInfo) =>{
                const ref = this.db.list('FORM').push(newFormInfo.payload);
                const ID: string | undefined = ref.key ? ref.key : undefined;
                const formWithId: FormInfo = {...newFormInfo.payload};
                formWithId.id = ID;
                this.db.object<FormInfo>('FORM/' + ID).update({'id': ID});
                return new AppActions.AddFormInfo(formWithId);
            })
        )
    });

    constructor(private actions$: Actions,
                private db: AngularFireDatabase){}
}