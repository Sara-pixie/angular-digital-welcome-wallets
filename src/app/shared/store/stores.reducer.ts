import { Store } from "../models/store.model";
import * as AppActions from './app.actions';

const placeholderStore: Store[] = [
    {
        storeName: 'string',
        storeAddress: 'string',
        storePhoneNumber: 'string'
    }
]
export function storesReducer(state: Store[] = placeholderStore, action: AppActions.Actions){
    switch(action.type){
        case AppActions.GET_STORES:
            return [...state];
        default:
            return state;
    }
}