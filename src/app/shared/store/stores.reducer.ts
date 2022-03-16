import { Store } from "../models/store.model";
import * as AppActions from './app.actions';

export function storesReducer(state: Store[] = [], action: AppActions.Actions){
    switch(action.type){
        case AppActions.GET_STORES:
            return [...(action as AppActions.GetStores).payload];
        default:
            return state;
    }
}