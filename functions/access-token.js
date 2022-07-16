
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

exports.handler = function(context, event, callback) {

    const client = context.getTwilioClient()
    const accountSid = client.accountSid
    const apiKey = context.API_KEY;
    const apiSecret = context.API_KEY_SECRET;
    
    const outgoingApplicationSid = context.APP_SID;

    console.log(event)
    console.log(event.identity)
    console.log(context.DEFAULT_IDENTITY)
 
    const identity = context.DEFAULT_IDENTITY;

    const token = new AccessToken(accountSid, apiKey, apiSecret);
  
    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid,
        incomingAllow: true
    });
   
    token.addGrant(voiceGrant);
    token.identity = identity

    data = {
        token: token.toJwt(),
        identity: event.identity
    };

    let response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    response.setBody(data)

    return callback(null, response);
};