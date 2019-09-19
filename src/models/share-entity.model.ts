export interface IPublicShare {
    UserId: string;
    Path: string;
    Type: string;
    ShareName: string;
    UserName: string;
    Invitees: string[]
    Files: any;
    CreatedOn: Date
    EditedOn: Date
}