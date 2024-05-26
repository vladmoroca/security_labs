let request = require("request");


let options = { method: 'POST',
    url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"dG9RzB82qEj9lSYCjgsGUWikomA1mmUc",\
        "client_secret":"POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6",\
        "audience":"https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/",\
        "grant_type":"client_credentials"}' };

let change_password = (newPassword, token) => {
    request({
        method: 'PATCH',
        url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/users/auth0|66280ab4aaab3de91b5653f2',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            password: `${newPassword}`,
            connection: 'Username-Password-Authentication'})
        }, function (error, response, body) {
        if (error) throw new Error(error);
            console.log(JSON.parse(body));
        });
    };
    
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    token = JSON.parse(body)['access_token'];
    change_password("New_STRONG3_password", token)
});