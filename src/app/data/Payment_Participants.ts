export class Payment_Participants {
    public userID: string;
    public paymentID: string;

    constructor(userID: string,
        paymentID: string) {
    
        this.userID = userID;
        this.paymentID = paymentID;
        }
}