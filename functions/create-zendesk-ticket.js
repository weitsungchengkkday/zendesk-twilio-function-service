
const axios = require('axios');

exports.handler = function(context, event, callback) {

    const response = axios.post(
        'https://kkday.zendesk.com/api/v2/channels/voice/tickets.json',
    {
      "display_to_agent": 362017534195,  // TODO
      "ticket": {
        "comment": {
          "body": "通話被接聽, 創建工單"
        },
        "priority": "urgent",
        "via_id": 46,
        "voice_comment": {
          "call_duration": Duration,
          "from": From,
          "to": To,
          "transcription_text": "這通電話基本資訊"
        }
      }
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
        auth: {
            username: 'zendesk@kkday.com/token',
            password: 'aldlxaR3ALhMXTfZl776XoGAdR6MoYlMlUaFqMFd'
        }
    });
    
    return response

}
