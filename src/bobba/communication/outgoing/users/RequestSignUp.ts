import ClientMessage from "../../protocol/ClientMessage";
import { SIGN_UP } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestSignUp extends ClientMessage {
    constructor(username: string, password: string, look: string) {
        super(SIGN_UP);
        this.appendString(username);
        this.appendString(look);
        this.appendString(password);
    }
}