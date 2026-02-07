```markdown
# Manage Environments with the Public API

Here are examples to help you manage your environments using the Public API. [page:1]

---

## List environments

Get all environments for a project. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query environments($projectId: String!) {
      environments(projectId: $projectId) {
        edges {
          node {
            id
            name
            createdAt
          }
        }
      }
    }`,
    variables: {
      "projectId": "project-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "projectId": "project-id" }
```

---

### Exclude ephemeral environments

Filter out PR/preview environments. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query environments($projectId: String!, $isEphemeral: Boolean) {
      environments(projectId: $projectId, isEphemeral: $isEphemeral) {
        edges {
          node {
            id
            name
            createdAt
          }
        }
      }
    }`,
    variables: {
      "projectId": "project-id",
      "isEphemeral": false
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "projectId": "project-id", "isEphemeral": false }
```

---

## Get a single environment

Fetch an environment by ID with its service instances. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query environment($id: String!) {
      environment(id: $id) {
        id
        name
        createdAt
        serviceInstances {
          edges {
            node {
              id
              serviceName
              latestDeployment {
                id
                status
              }
            }
          }
        }
      }
    }`,
    variables: {
      "id": "environment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "id": "environment-id" }
```

---

## Create an environment

Create a new environment. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation environmentCreate($input: EnvironmentCreateInput!) {
      environmentCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "name": "staging"
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
    "name": "staging"
  }
}
```

Optional fields (4 available). [page:1]

---

## Rename an environment

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation environmentRename($id: String!, $input: EnvironmentRenameInput!) {
      environmentRename(id: $id, input: $input)
    }`,
    variables: {
      "id": "environment-id",
      "input": {
        "name": "new-name"
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
  "id": "environment-id",
  "input": { "name": "new-name" }
}
```

---

## Delete an environment

This will delete the environment and all its deployments. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation environmentDelete($id: String!) {
      environmentDelete(id: $id)
    }`,
    variables: {
      "id": "environment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "id": "environment-id" }
```

---

## Get environment logs

Fetch logs from all services in an environment. [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query environmentLogs($environmentId: String!, $filter: String) {
      environmentLogs(environmentId: $environmentId, filter: $filter) {
        timestamp
        message
        severity
        tags {
          serviceId
          deploymentId
        }
      }
    }`,
    variables: {
      "environmentId": "environment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "environmentId": "environment-id" }
```

Optional fields (1 available). [page:1]

---

## Staged changes

Railway supports staging variable changes before deploying them. [page:1]

### Get staged changes

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query environmentStagedChanges($environmentId: String!) {
      environmentStagedChanges(environmentId: $environmentId)
    }`,
    variables: {
      "environmentId": "environment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "environmentId": "environment-id" }
```

### Commit staged changes

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation environmentPatchCommitStaged($environmentId: String!) {
      environmentPatchCommitStaged(environmentId: $environmentId)
    }`,
    variables: {
      "environmentId": "environment-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

**Variables** [page:1]

```json
{ "environmentId": "environment-id" }
```
```