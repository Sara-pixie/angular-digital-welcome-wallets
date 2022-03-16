import { FormInfo } from "../models/formInfo.model";
import * as AppActions from './app.actions';

export function formInfoReducer(state: FormInfo[] = [], action: AppActions.Actions){
    switch(action.type){
        case AppActions.ADD_FORM_INFO:
            return [...state, (action as AppActions.AddFormInfo).payload];
        case AppActions.GET_FORMS_INFO:
            return [...(action as AppActions.GetFormsInfo).payload];
        default:
            return state;
    }
}