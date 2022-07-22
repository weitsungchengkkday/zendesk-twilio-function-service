
const axios = require('axios');
const url = require('url');

exports.handler = function(context, event, callback) {
    
    (async () => {
        
        // Get test custom field data
        let response = new Twilio.Response();
        let data = await getOrderData()
        let orderData = JSON.stringify(data)

        let result = await createTicketAndOpenAgentBrowser(orderData, "1e6f1001-2add-6e00-fc64-92361f002671", 2212345678)
        console.log(result)
    
        async function getOrderData() {
        
            let res = await axios.get(`https://${context.DOMAIN_NAME}/test_order_data.json`)
            let data = res.data;

            return data 
        }
    
        // Create 
        async function createTicketAndOpenAgentBrowser(orderData, memberUuid, orderMid) {

            let payload = {
                "display_to_agent":362017534195,
                "via_id":45,
                "ticket":{
                    "subject":"YY iii",
                    "comment":{
                       "body":"The OOXX."
                    },
                    "custom_fields":[
                       {
                          "id":5186722333455,
                          "value":orderData
                       },
                       {
                          "id":5186681882895,
                          "value":memberUuid
                       },
                       {
                          "id":5186698378767,
                          "value":orderMid
                       }
                    ]
                 }
             };

            const headers = {
                'Content-Type': 'application/json'
            }
              
            let res = await axios.post('https://kkday.zendesk.com/api/v2/channels/voice/tickets.json', payload, {
                headers: headers,
                auth: {
                    username: 'zendesk@kkday.com/token',
                    password: 'p6PDFeRZ1bjuUWy4UNxtTxuqkwhAllNloGD8Ser1'
                }
            });
            let data = res.data;

            return data
        }

        return callback(null, response)

    })()


}
