import { Product } from "../biller/constructors";

export interface Category {
    id:string;
    name:string;
    products:Product[];
    averagePrice?:number;
}

export interface Ingredient {
    id?:string;
    name:string;
    price:number;
}
export interface Menu {
    id?:string;
    name:string;
    description:string;
    templates:string[];
    categories:Category[];
    createdAt?:Date;
    updatedAt?:Date;
}
export interface MenuData {
    id?:string;
    name:string;
    description:string;
    templates:string[];
    createdAt?:Date;
    updatedAt?:Date;
}

// export interface TableConstructor {
//     id?:string;
//     name:string;
//     createdAt:Date;
//     updatedAt:Date;
//     seatingSpace:number;
//     associatedBill?:string;
//     status:'available'|'occupied'|'reserved'|'outOfOrder';
// }
