import { Timestamp } from "@angular/fire/firestore";

export interface UserRecord{
    name:string;
    userId:string;
    email:string;
    image:string;
    lastLogin:Timestamp;
    business:UserBusiness[];
}
export interface UserBusiness{
    businessId:string;
    access:Access;
    joiningDate:Timestamp;
}
export interface BusinessRecord{
    businessId:string;
    name:string;
    address:string;
    phone:string;
    email:string;
    image:string;
    users:string[];
}
export interface Access {
    lastUpdated:Timestamp;
    updatedBy:string;
    accessLevel:'admin'|'manager'|'employee';
}