```md
# Manage Services with the Public API

Here are examples to help you manage your services using the Public API.

---

## Get a service

Fetch a service by ID:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query service($id: String!) {
      service(id: $id) {
        id
        name
        icon
        createdAt
        projectId
      }
    }`,
    variables: {
      "id": "service-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "id": "service-id" }
```

---

## Get a service instance

Get detailed service configuration for a specific environment:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query serviceInstance($serviceId: String!, $environmentId: String!) {
      serviceInstance(serviceId: $serviceId, environmentId: $environmentId) {
        id
        serviceName
        startCommand
        buildCommand
        rootDirectory
        healthcheckPath
        region
        numReplicas
        restartPolicyType
        restartPolicyMaxRetries
        latestDeployment {
          id
          status
          createdAt
        }
      }
    }`,
    variables: {
      "serviceId": "service-id",
      "environmentId": "environment-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "serviceId": "service-id", "environmentId": "environment-id" }
```

---

## Create a service

### From a GitHub repository

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceCreate($input: ServiceCreateInput!) {
      serviceCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "name": "My API",
        "source": {
          "repo": "username/repo-name",
        },
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "input": {
    "projectId": "project-id",
    "name": "My API",
    "source": { "repo": "username/repo-name" }
  }
}
```

(Optional fields available.)

### From a Docker image

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceCreate($input: ServiceCreateInput!) {
      serviceCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "name": "Redis",
        "source": {
          "image": "redis:7-alpine",
        },
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "input": {
    "projectId": "project-id",
    "name": "Redis",
    "source": { "image": "redis:7-alpine" }
  }
}
```

(Optional fields available.)

### Empty service (no source)

Create an empty service that you can configure later:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceCreate($input: ServiceCreateInput!) {
      serviceCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "name": "Backend API",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "input": {
    "projectId": "project-id",
    "name": "Backend API"
  }
}
```

(Optional fields available.)

---

## Update a service

Update service name or icon:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceUpdate($id: String!, $input: ServiceUpdateInput!) {
      serviceUpdate(id: $id, input: $input) {
        id
        name
        icon
      }
    }`,
    variables: {
      "id": "service-id",
      "input": {
        "name": "Renamed Service",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "id": "service-id",
  "input": { "name": "Renamed Service" }
}
```

(Optional fields available.)

---

## Update service instance settings

Update build/deploy settings for a service in a specific environment:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceInstanceUpdate(
      $serviceId: String!,
      $environmentId: String!,
      $input: ServiceInstanceUpdateInput!
    ) {
      serviceInstanceUpdate(
        serviceId: $serviceId,
        environmentId: $environmentId,
        input: $input
      )
    }`,
    variables: {
      "serviceId": "service-id",
      "environmentId": "environment-id",
      "input": {
        "startCommand": "npm run start",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id",
  "input": { "startCommand": "npm run start" }
}
```

(Optional fields available.)

---

## Connect a service to a repo

Connect an existing service to a GitHub repository:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceConnect($id: String!, $input: ServiceConnectInput!) {
      serviceConnect(id: $id, input: $input) {
        id
      }
    }`,
    variables: {
      "id": "service-id",
      "input": {
        "repo": "username/repo-name",
        "branch": "main",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "id": "service-id",
  "input": {
    "repo": "username/repo-name",
    "branch": "main"
  }
}
```

---

## Disconnect a service from a repo

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceDisconnect($id: String!) {
      serviceDisconnect(id: $id) {
        id
      }
    }`,
    variables: {
      "id": "service-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "id": "service-id" }
```

---

## Deploy a service

Trigger a new deployment for a service:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceInstanceDeployV2(
      $serviceId: String!,
      $environmentId: String!
    ) {
      serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId)
    }`,
    variables: {
      "serviceId": "service-id",
      "environmentId": "environment-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id"
}
```

This returns the deployment ID.

---

## Redeploy a service

Redeploy the latest deployment:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceInstanceRedeploy(
      $serviceId: String!,
      $environmentId: String!
    ) {
      serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
    }`,
    variables: {
      "serviceId": "service-id",
      "environmentId": "environment-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id"
}
```

---

## Get resource limits

Get the resource limits for a service instance (returns a JSON object):

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query serviceInstanceLimits(
      $serviceId: String!,
      $environmentId: String!
    ) {
      serviceInstanceLimits(serviceId: $serviceId, environmentId: $environmentId)
    }`,
    variables: {
      "serviceId": "service-id",
      "environmentId": "environment-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id"
}
```

---

## Delete a service

This will delete the service and all its deployments:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation serviceDelete($id: String!) {
      serviceDelete(id: $id)
    }`,
    variables: {
      "id": "service-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "id": "service-id" }
```
```