 
exports.handler = function(context, event, callback) {

    const taskrouter = Twilio.jwt.taskrouter;
    const util = taskrouter.util;

    const TaskRouterCapability = taskrouter.TaskRouterCapability;
    const Policy = TaskRouterCapability.Policy;
  
    const client = context.getTwilioClient()
    const accountSid = client.accountSid
    const authToken = client.password
    
    const workspaceSid = context.WORKER_SPACE_SID

    // get workerSid from user_email 
    const workerSid = "WKe237ec23c6414392a91cb7f5e353b4c5"

    const TASKROUTER_BASE_URL = 'https://taskrouter.twilio.com';
    const version = 'v1';
  
    const capability = new TaskRouterCapability({
      accountSid: accountSid,
      authToken: authToken,
      workspaceSid: workspaceSid,
      channelId: workerSid
    });

    // Helper function to create Policy
    function buildWorkspacePolicy(options) {
        options = options || {};
        var resources = options.resources || [];
        var urlComponents = [TASKROUTER_BASE_URL, version, 'Workspaces', workspaceSid]
    
        return new Policy({
            url: urlComponents.concat(resources).join('/'),
            method: options.method || 'GET',
            allow: true
        });
    }

    // Event Bridge Policies
    const eventBridgePolicies = util.defaultEventBridgePolicies(accountSid, workerSid);

    // Worker Policies
    const workerPolicies = util.defaultWorkerPolicies(version, workspaceSid, workerSid);

    var workspacePolicies = [
        // Workspace fetch Policy
        buildWorkspacePolicy(),
        buildWorkspacePolicy({ method: 'POST' }),
        buildWorkspacePolicy({ resources: ['**'] }),
        buildWorkspacePolicy({ resources: ['**'], method: 'POST' }),
        // Workspace Activities Update Policy
        buildWorkspacePolicy({ resources: ['Activities'] }),
        buildWorkspacePolicy({ resources: ['Activities'], method: 'POST' }),
        buildWorkspacePolicy({ resources: ['Activities', '**'] }),
        buildWorkspacePolicy({ resources: ['Activities', '**'], method: 'POST' }),
        // Workspace Activities Worker Policy
        buildWorkspacePolicy({ resources: ['Workers', workerSid, ] }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, ], method: 'POST' }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, '**'] }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, '**'], method: 'POST' }),
        // Workspace Activities Worker Reserations Policy
        buildWorkspacePolicy({ resources: ['Workers', workerSid, 'Reservations'] }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, 'Reservations'], method: 'POST' }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, 'Reservations', '**'] }),
        buildWorkspacePolicy({ resources: ['Workers', workerSid, 'Reservations', '**'], method: 'POST' }),
    ]

    eventBridgePolicies.concat(workerPolicies).concat(workspacePolicies).forEach(function (policy) {
        capability.addPolicy(policy);
    });

    const token = capability.toJwt();

    data = {
        token: token
    };

    let response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    response.setBody(data)

    return callback(null, response);

};
