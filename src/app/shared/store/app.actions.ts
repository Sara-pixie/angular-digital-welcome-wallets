import { Action } from "@ngrx/store";
import { FormInfo } from "../models/formInfo.model";
import { Store } from "../models/store.model";

export const GET_STORES_START = 'GetStoresStart';
export const GET_STORES = 'GetStores';
export const GET_FORMS_INFO_START = 'GetFormsInfoStart';
export const GET_FORMS_INFO = 'GetFormsInfo';
export const ADD_FORM_INFO_START = 'AddFormInfoStart';
export const ADD_FORM_INFO = 'AddFormInfo';

// Get Stores
export class GetStoresStart implements Action {
    readonly type: string = GET_STORES_START;
}
export class GetStores implements Action {
    readonly type: string = GET_STORES;
    constructor(public payload: Store[]){}
}

// get FormsInfo
export class GetFormsInfoStart implements Action {
    readonly type: string = GET_FORMS_INFO_START;
}
export class GetFormsInfo implements Action {
    readonly type: string = GET_FORMS_INFO;
    constructor(public payload: FormInfo[]){}
}

// add FormInfo
export class AddFormInfoStart implements Action {
    readonly type: string = ADD_FORM_INFO_START;
    constructor(public payload: FormInfo){}
}
export class AddFormInfo implements Action {
    readonly type: string = ADD_FORM_INFO;
    constructor(public payload: FormInfo){}
}

export type Actions = 
    GetStoresStart |
    GetStores |
    GetFormsInfoStart |
    GetFormsInfo |
    AddFormInfoStart |
    AddFormInfo;