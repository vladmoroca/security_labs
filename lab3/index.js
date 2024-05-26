let request = require("request");

let user_token_options = { method: 'POST',
  url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  form:
   { grant_type: 'password',
     username: 'example3@example.com',
     password: 'New_STRONG3_password',
     audience: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/',
     scope: 'offline_access',
     client_id: 'dG9RzB82qEj9lSYCjgsGUWikomA1mmUc',
     client_secret: 'POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6' }
   };


let refresh_token = (token) =>{
    request({ method: 'POST',
        url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: 'dG9RzB82qEj9lSYCjgsGUWikomA1mmUc',
            client_secret: 'POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6',
            refresh_token: token
        })
    }, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(JSON.parse(body));
      });
}



  
request(user_token_options, function (error, response, body) {
    if (error) throw new Error(error);
    token = JSON.parse(body)['refresh_token'];
    refresh_token(token)
});