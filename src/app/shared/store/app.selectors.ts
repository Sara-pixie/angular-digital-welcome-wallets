import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormInfo } from "../models/formInfo.model";
import { Store } from "../models/store.model";

const storesFeature = createFeatureSelector<Store[]>('stores');
const formsInfoFeature = createFeatureSelector<FormInfo[]>('allFormsInfo');

export const allStores = createSelector(storesFeature, (state: Store[]) => state);
export const allFormsInfo = createSelector(formsInfoFeature, (state: FormInfo[]) => state);
export const oneStoreInfo = (index: number) => createSelector(storesFeature, (state: Store[]) => {
    if(state.length > 0){
        return state[index];
    } else {
        return null;
    }
});