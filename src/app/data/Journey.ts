export class Journey {
  public name: string;
  public people: Array<string>;
  public defaultCurrency: string; //TODO
  public start: Date;
  public end: Date;
  public creator: string;
  public inviteCode: number;
  public active: boolean;

  constructor(name: string,
    people: Array<string>,
    defaultCurrency: string,
    start: Date,
    end: Date,
    creator: string,
    inviteCode: number,
    active: boolean) {

    this.name = name;
    this.people = people;
    this.defaultCurrency = defaultCurrency;
    this.start = start;
    this.end = end;
    this.creator = creator;
    this.inviteCode = inviteCode;
    this.active = active;
    }

}
