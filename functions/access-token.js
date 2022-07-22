
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

exports.handler = function(context, event, callback) {

    (async () => {
        const client = context.getTwilioClient()
        const accountSid = client.accountSid
        const apiKey = context.API_KEY;
        const apiSecret = context.API_KEY_SECRET;
        const outgoingApplicationSid = context.APP_SID;

        let zendesk_user_email = event.zendesk_user_email ? event.zendesk_user_email : "zendesk@kkday.com"
        console.log(zendesk_user_email);
   
        let worker = await getWorker(zendesk_user_email)
        console.log("Woker: ", worker)

        let attributes_obj = JSON.parse(worker.attributes)
        let identity = attributes_obj.identity ? attributes_obj.identity : context.DEFAULT_IDENTITY
        console.log("Identity: ", identity)

        const token = new AccessToken(accountSid, apiKey, apiSecret);
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: outgoingApplicationSid,
            incomingAllow: true
        });
    
        token.addGrant(voiceGrant);
        token.identity = identity

        data = {
            token: token.toJwt(),
            identity: identity
        };

        let response = new Twilio.Response();
        response.appendHeader('Access-Control-Allow-Origin', '*');
        response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
        response.appendHeader('Content-Type', 'application/json');
        response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

        response.setBody(data)

        return callback(null, response);

        function getWorker(email) {

            return client.taskrouter.v1.workspaces(context.WORKER_SPACE_SID)
                    .workers
                    .list()
                    .then(workers => {
    
                        let select_worker = null

                        workers.forEach(worker => {
                            let attributes_obj = JSON.parse(worker.attributes)
                            if (attributes_obj.user_email == email) {
                                select_worker = worker
                            }
                        });

                        return select_worker
                    });
        }
    })()
};