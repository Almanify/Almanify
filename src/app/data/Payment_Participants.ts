import {EntityWithMultipleForeignKeys} from "./EntityWithMultipleForeignKeys";

export class Payment_Participants extends EntityWithMultipleForeignKeys{
    public userID: string;
    public paymentID: string;

    constructor(userID: string,
        paymentID: string) {
        super();
        this.userID = userID;
        this.paymentID = paymentID;
        }
}
