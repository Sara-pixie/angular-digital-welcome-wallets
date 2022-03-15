import { FormInfo } from "../models/formInfo.model";
import { Store } from "../models/store.model";

export interface AppState {
  readonly stores: Store[];
  readonly allFormsInfo: FormInfo[];
}