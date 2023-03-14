import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class LoginFailed implements IIncomingEvent {
    handle(request: ServerMessage) {
        const message = request.popString();
        BobbaEnvironment.getGame().handleUserError(message);
    }
}