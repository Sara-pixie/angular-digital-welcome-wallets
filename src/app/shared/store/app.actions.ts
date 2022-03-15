import { Action } from "@ngrx/store";
import { FormInfo } from "../models/formInfo.model";

export const GET_STORES = 'GetStores';
export const GET_FORMS_INFO = 'GetFormsInfo';
export const ADD_FORM_INFO = 'AddFormInfo';

export class GetStores implements Action {
    readonly type: string = GET_STORES;
}
export class GetFormsInfo implements Action {
    readonly type: string = GET_FORMS_INFO;
}
export class AddFormInfo implements Action {
    readonly type: string = ADD_FORM_INFO;
    constructor(public payload: FormInfo){}
}

export type Actions = 
    GetStores |
    GetFormsInfo |
    AddFormInfo;