# Create dynamic Endpoints to mock and test REST APIs

Quickly and easily spin up this NodeJS code which will allow you to create any endpoint and run tests against it. It supports the following:
- Specify a unique key to segregate your projects
- Create endpoints that will listen on pretty much any HTTP verb
- Send back static JSON responses
- Add delays to your endpoints
- List all your endpoints and see how many time they were called
- Delete all the endpoints for a specific unique key
- Host in docker or your local machine.
- **Admin**: List all endpoints on the system
<br />

## Full documentation with examples
https://documenter.getpostman.com/view/3224442/2sAY4si4U1 
<br />
<br />
<br />

## Creating an Endpoint JSON keys
- **myUniqueKey**: Must be exactly 16 characters. This will be unique to you and all your endpoints. Use it to segregate e.g. projects or incidents.
- **endpoint**: e.g. /my/endpoint. Concatenate myUniqueKey with this value to get your full endpoint. 
- **httpVerb**: e.g. GET, POST, or DELETE. You need to call this endpoint as the verb you specify here.
- **responseCode**: The response code you want this endpoint to return.
- **responseBodyInJson**: The JSON you want this endpoint to return.
- **responseDelay**: Delay in milliseconds, maximum 10 seconds. Useful to test timeouts and such.
<br />

## Example to create an Endpoint
```
curl --location 'http://<ip here>/create-endpoint' \
--data '{
    "myUniqueKey": "proj1_20241024__", //Must be exactly 16 characters. This will be unique to you and all your endpoints
    "endpoint": "/my/endpoint/ratelimit", //Concatenate myUniqueKey with this value e.g. /aaaaaabbbbbccccc/my/endpoint
    "httpVerb": "GET", //You need to call this endpoint as a POST
    "responseCode": 429, //Will always be returned in the response
    "responseBodyInJson": { "message": "you shall not pass!!" }, //Will always be returned in the response
    "responseDelay": 2000 //Delay the response by this much. Useful to test timeouts and such
}
'
```
<br />

### Now call that Endpoint
```
curl --location --request POST 'http://<ip here>/proj1_20241024__/my/endpoint'
```

#### Response from that Endpoint
```
{
  "message": "Success!"
}
```
