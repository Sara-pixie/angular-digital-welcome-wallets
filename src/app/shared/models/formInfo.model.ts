export class FormInfo{
    public storeName: string;
	public date: string;
	public servedBy: string;
	public email: string;
	public btBroadbrend: string;
	public btTvPackage: string;
	public sportPackage: string;
	public totalPayment: number;
	public otherHandyInfo: string;

    constructor(object?: any){
        this.storeName = object.storeName;
        this.date = object.date;
        this.servedBy = object.servedBy;
        this.email = object.email;
        this.btBroadbrend = object.btBroadbrend;
        this.btTvPackage = object.btTvPackage;
        this.sportPackage = object.sportPackage;
        this.totalPayment = object.totalPayment;
        this.otherHandyInfo = object.otherHandyInfo ? object.otherHandyInfo : null;
    }
}