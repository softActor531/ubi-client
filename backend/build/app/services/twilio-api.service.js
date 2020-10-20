"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@foal/core");
const Twilio = __importStar(require("twilio"));
const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
const twilioAccountSid = core_1.Config.get2('twilio.accountSid');
const twilioApiKey = core_1.Config.get2('twilio.apiKey');
const twilioApiSecret = core_1.Config.get2('twilio.apiSecret');
const twilioChatServiceSid = core_1.Config.get2('twilio.chatServiceSid');
class TwilioApi {
    getRoomToken(room, identity) {
        const tokenOptions = {
            identity
        };
        const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, tokenOptions);
        const videoGrant = new VideoGrant({ room });
        const chatGrant = new ChatGrant({ serviceSid: twilioChatServiceSid });
        // Add the grant to the token
        token.addGrant(videoGrant);
        token.addGrant(chatGrant);
        return {
            roomName: room,
            userName: identity,
            token: token.toJwt()
        };
    }
}
exports.TwilioApi = TwilioApi;
//# sourceMappingURL=twilio-api.service.js.map