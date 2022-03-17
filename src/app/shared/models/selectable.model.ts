import { FormInfo } from "./formInfo.model";

export class Selectable extends FormInfo{
    public isSelected: boolean;
    constructor(object: FormInfo){
        super(object);
        this.isSelected = false;
    }
}