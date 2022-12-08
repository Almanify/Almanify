export class JourneyParticipation {
    public userID: string;
    public journeyID: string;

    constructor(userID: string,
        journeyID: string) {

        this.userID = userID;
        this.journeyID = journeyID;
        }
}
