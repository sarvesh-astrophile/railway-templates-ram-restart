```markdown
# Manage Deployments with the Public API

Here are examples to help you manage your deployments using the Public API. [page:1]

## List deployments

Get all deployments for a service in an environment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query deployments($input: DeploymentListInput!, $first: Int) {
      deployments(input: $input, first: $first) {
        edges {
          node {
            id
            status
            createdAt
            url
            staticUrl
          }
        }
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "serviceId": "service-id",
        "environmentId": "environment-id"
      },
      "first": 10
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "input": {
    "projectId": "project-id",
    "serviceId": "service-id",
    "environmentId": "environment-id"
  },
  "first": 10
}
```

## Get a single deployment

Fetch a deployment by ID: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query deployment($id: String!) {
      deployment(id: $id) {
        id
        status
        createdAt
        url
        staticUrl
        meta
        canRedeploy
        canRollback
      }
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Get latest active deployment

Get the currently running deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query latestDeployment($input: DeploymentListInput!) {
      deployments(input: $input, first: 1) {
        edges {
          node {
            id
            status
            url
            createdAt
          }
        }
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "serviceId": "service-id",
        "environmentId": "environment-id",
        "status": {
          "successfulOnly": true
        }
      }
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "input": {
    "projectId": "project-id",
    "serviceId": "service-id",
    "environmentId": "environment-id",
    "status": {
      "successfulOnly": true
    }
  }
}
```

## Get build logs

Fetch build logs for a deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query buildLogs($deploymentId: String!, $limit: Int) {
      buildLogs(deploymentId: $deploymentId, limit: $limit) {
        timestamp
        message
        severity
      }
    }`,
    variables: {
      "deploymentId": "deployment-id",
      "limit": 500
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "deploymentId": "deployment-id",
  "limit": 500
}
```

## Get runtime logs

Fetch runtime logs for a deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query deploymentLogs($deploymentId: String!, $limit: Int) {
      deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
        timestamp
        message
        severity
      }
    }`,
    variables: {
      "deploymentId": "deployment-id",
      "limit": 500
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "deploymentId": "deployment-id",
  "limit": 500
}
```

Optional fields (3 available). [page:1]

## Get HTTP logs

Fetch HTTP request logs for a deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query httpLogs($deploymentId: String!, $limit: Int) {
      httpLogs(deploymentId: $deploymentId, limit: $limit) {
        timestamp
        requestId
        method
        path
        httpStatus
        totalDuration
        srcIp
      }
    }`,
    variables: {
      "deploymentId": "deployment-id",
      "limit": 100
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "deploymentId": "deployment-id",
  "limit": 100
}
```

## Trigger a redeploy

Redeploy an existing deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentRedeploy($id: String!) {
      deploymentRedeploy(id: $id) {
        id
        status
      }
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Restart a deployment

Restart a running deployment without rebuilding: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentRestart($id: String!) {
      deploymentRestart(id: $id)
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Rollback to a deployment

Rollback to a previous deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentRollback($id: String!) {
      deploymentRollback(id: $id) {
        id
        status
      }
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

You can only rollback to deployments that have `canRollback: true`. [page:1]

## Stop a deployment

Stop a running deployment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentStop($id: String!) {
      deploymentStop(id: $id)
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Cancel a deployment

Cancel a deployment that is building or queued: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentCancel($id: String!) {
      deploymentCancel(id: $id)
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Remove a deployment

Remove a deployment from the history: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation deploymentRemove($id: String!) {
      deploymentRemove(id: $id)
    }`,
    variables: {
      "id": "deployment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "id": "deployment-id"
}
```

## Deploy a specific service in an environment

Trigger a deployment for a specific service: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation environmentTriggersDeploy($input: EnvironmentTriggersDeployInput!) {
      environmentTriggersDeploy(input: $input)
    }`,
    variables: {
      "input": {
        "environmentId": "environment-id",
        "projectId": "project-id",
        "serviceId": "service-id"
      }
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{
  "input": {
    "environmentId": "environment-id",
    "projectId": "project-id",
    "serviceId": "service-id"
  }
}
```

## Deployment statuses

| Status      | Description                           |
|------------|----------------------------------------|
| `BUILDING` | Deployment is being built             |
| `DEPLOYING`| Deployment is being deployed          |
| `SUCCESS`  | Deployment is running successfully    |
| `FAILED`   | Deployment failed to build or deploy  |
| `CRASHED`  | Deployment crashed after starting     |
| `REMOVED`  | Deployment was removed                |
| `SLEEPING` | Deployment is sleeping (inactive)     |
| `SKIPPED`  | Deployment was skipped                |
| `WAITING`  | Deployment is waiting for approval    |
| `QUEUED`   | Deployment is queued                  | [page:1]
```