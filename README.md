# 🚀 Create dynamic REST endpoints the easy way

Spin up this Node.js app in Docker or as a standalone app to create custom endpoints and run tests against them. Its only dependency is Express. 🧪

---
<br />


## 📚 Documentation with Examples
Check it out [https://dynamicendpoint.leighonline.net/documentation](https://dynamicendpoint.leighonline.net/documentation) (redirects to Postman documentation).

---
<br />


## 🤩 Try it out!
But read the documentation first 🎓😎

https://dynamicendpoint.leighonline.net/api/  🎉🥳🎊🎁

---
<br />


## 🌟 **Features**
- **Flexible HTTP Support**: Each endpoint is unique across `myUniqueKey`, `endpoint`, and `verb` values, allowing the same endpoint path to respond on multiple HTTP verbs (e.g., `PUT`, `DELETE`, `GET`) with different response codes, messages, and delays.
- **Project Segregation**: Use `myUniqueKey` to separate your projects 🗂️.
- **Customizable Responses**: 
   - Respond with any **HTTP code** (e.g., 200, 404, 500)
   - Return any **JSON payload** 💾
   - Add **delays** up to 10 seconds 🕒
- **Endpoint Management**:
   - List all endpoints and view call counts 📊
   - Update an existing endpoint’s configuration
   - Delete all endpoints associated with a specific unique key 🧹
- **Deployment Flexibility**: Run locally or in Docker 🐳.
- **Admin Tools**: Admins can list all endpoints on the system 🔐.

<br />


## 🔠 Environment Variables
You will need to create the following environment variables:
- **DYNAMIC_EP_ADMIN_KEY** == the secret admin key to view all endpoints.
- **DYNAMIC_EP_HOSTNAME** || '0.0.0.0' == the hostname express must listen on. For the most part '0.0.0.0' is fine.
- **DYNAMIC_EP_PORT** || 3000 == the port express must listen on. For the most part 3000 is fine. If you do change it, update your docker compose file.

---
<br />


## 🔧 Dynamic Endpoint JSON Keys
Each endpoint requires the following JSON keys. You can get more information in the documentation:
- **`myUniqueKey`** 🗝️: Exactly 16 characters. Unique to you and all your endpoints, useful for organizing by project or incident.
- **`endpoint`** 🛠️: The endpoint path, such as `/my/endpoint`. Combined with `myUniqueKey` for the full endpoint.
- **`httpVerb`** 🔀: The HTTP method you’ll use, such as `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`.
- **`responseCode`** ✅: HTTP response code you want the endpoint to return.
- **`responseBodyInJson`** 📄: The JSON object that this endpoint will return in the response.
- **`responseDelay`** 🕰️: Delay the response in milliseconds, up to 10,000 (10 seconds) for testing timeouts.

---
<br />


## 🤤 **Teaser: Create a dynamic endpoint**

```bash
curl --location 'http://<ip here>/api/create-endpoint' \
--header 'Content-Type: application/json' \
--data '{
    "myUniqueKey": "proj1_20241024__", 
    "endpoint": "/my/endpoint/ratelimit", 
    "httpVerb": "GET", 
    "responseCode": 429, 
    "responseBodyInJson": { "message": "you shall not pass!!" }, 
    "responseDelay": 2000 
}'
```

#### 📄 **Now call this endpoint**

```bash
curl --location --request GET 'http://<ip here>/api/proj1_20241024__/my/endpoint/ratelimit'
```

#### 📄 **The response from this endpoint**
It will be 429 response and there will be a 2 second delay.

```json
{
  "message": "you shall not pass!!"
}
```
