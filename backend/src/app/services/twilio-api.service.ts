import { Config } from '@foal/core'
import * as Twilio from 'twilio'

const AccessToken = Twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const ChatGrant = AccessToken.ChatGrant

const twilioAccountSid = Config.get2('twilio.accountSid')
const twilioApiKey = Config.get2('twilio.apiKey')
const twilioApiSecret = Config.get2('twilio.apiSecret')
const twilioChatServiceSid = Config.get2('twilio.chatServiceSid')

export class TwilioApi {

  getRoomToken(room: string, identity: string) {
    const tokenOptions = {
      identity
    }
    const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, tokenOptions)
    const videoGrant = new VideoGrant({ room })
    const chatGrant = new ChatGrant({ serviceSid: twilioChatServiceSid })

    // Add the grant to the token
    token.addGrant(videoGrant)
    token.addGrant(chatGrant)

    return {
      roomName: room,
      userName: identity,
      token: token.toJwt()
    }
  }

}
