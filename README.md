# 🚀 Create dynamic endpoints to mock and test REST APIs quickly and easily

Spin up this Node.js app in Docker or as a standalone app to create custom endpoints and run tests against them. Its only dependency is Express. 🧪

### 🌟 **Features**
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

## 📚 Full Documentation with Examples
Find the complete guide at [https://dynamicendpoint.leighonline.net](https://dynamicendpoint.leighonline.net) (redirects to Postman documentation).

---
<br />

## 🔧 Endpoint Configuration Keys

Each endpoint requires the following JSON keys:
- **`myUniqueKey`** 🗝️: Exactly 16 characters. Unique to you and all your endpoints, useful for organizing by project or incident.
- **`endpoint`** 🛠️: The endpoint path, such as `/my/endpoint`. Combined with `myUniqueKey` for the full endpoint.
- **`httpVerb`** 🔀: The HTTP method you’ll use, such as `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`.
- **`responseCode`** ✅: HTTP response code you want the endpoint to return.
- **`responseBodyInJson`** 📄: The JSON object that this endpoint will return in the response.
- **`responseDelay`** 🕰️: Delay the response in milliseconds, up to 10,000 (10 seconds) for testing timeouts.

---
<br />

## 📄 **Example: Creating an Endpoint**

```bash
curl --location 'http://<ip here>/create-endpoint' \
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

<br />

## 📄 **Example: Calling the Endpoint**

```bash
curl --location --request GET 'http://<ip here>/proj1_20241024__/my/endpoint/ratelimit'
```

#### 📄 **Example: Response from the Endpoint**

```json
{
  "message": "you shall not pass!!"
}
```
