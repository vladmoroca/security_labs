let request = require("request");

let access_token = ''

let options = { method: 'POST',
    url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"dG9RzB82qEj9lSYCjgsGUWikomA1mmUc",\
        "client_secret":"POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6",\
        "audience":"https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/",\
        "grant_type":"client_credentials"}' };

let create_user = (token) => {
    request({
        method: 'POST',
        url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/users',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email: 'example7@example.com',
            password: 'very_Strong1_password',
            connection: 'Username-Password-Authentication'
        })
    }, function (error, response, body) {
        if (error) throw new Error(error);
      });
}
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    access_token = JSON.parse(body)['access_token'];
    create_user(access_token)
});
