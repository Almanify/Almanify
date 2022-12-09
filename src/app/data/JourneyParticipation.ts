import {DatabaseEntity} from "./DatabaseEntity";
import {EntityWithMultipleForeignKeys} from "./EntityWithMultipleForeignKeys";


export class JourneyParticipation extends EntityWithMultipleForeignKeys{
    public userID: string;
    public journeyID: string;
    constructor(userID: string,
        journeyID: string) {
        super();
        this.userID = userID;
        this.journeyID = journeyID;
        }
}
