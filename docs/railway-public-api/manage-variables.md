```markdown
# Manage Variables with the Public API

Here are examples to help you manage your environment variables using the Public API. [page:1]

## Get variables

Fetch variables for a service in an environment: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query variables($projectId: String!, $environmentId: String!, $serviceId: String) {
      variables(
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
      )
    }`,
    variables: {
      "projectId": "project-id",
      "environmentId": "environment-id",
      "serviceId": "service-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id" }` [page:1]

**Response:** [page:1]

```json
{
  "data": {
    "variables": {
      "DATABASE_URL": "postgres://...",
      "NODE_ENV": "production",
      "PORT": "3000"
    }
  }
}
```
[page:1]

Omit `serviceId` to get shared variables for an environment instead. [page:1]

## Get unrendered variables

Get variables with references intact (not resolved): [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query variables($projectId: String!, $environmentId: String!, $serviceId: String, $unrendered: Boolean) {
      variables(
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
        unrendered: $unrendered
      )
    }`,
    variables: {
      "projectId": "project-id",
      "environmentId": "environment-id",
      "serviceId": "service-id",
      "unrendered": true,
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id", "unrendered": true }` [page:1]

This returns variables like `${{Postgres.DATABASE_URL}}` instead of the resolved value. [page:1]

## Create or update a variable

Upsert a single variable: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation variableUpsert($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "environmentId": "environment-id",
        "serviceId": "service-id",
        "name": "API_KEY",
        "value": "secret-key-here",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "input": { "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id", "name": "API_KEY", "value": "secret-key-here" } }` [page:1]

Optional fields are available on the input. [page:1]  
Omit `serviceId` to create a shared variable instead. [page:1]

## Upsert multiple variables

Update multiple variables at once: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
      variableCollectionUpsert(input: $input)
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "environmentId": "environment-id",
        "serviceId": "service-id",
        "variables": {
          "DATABASE_URL": "postgres://...",
          "REDIS_URL": "redis://...",
          "NODE_ENV": "production",
        },
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "input": { "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id", "variables": { "DATABASE_URL": "postgres://...", "REDIS_URL": "redis://...", "NODE_ENV": "production" } } }` [page:1]

Optional fields are available on the input. [page:1]  
Using `replace: true` will delete all variables not included in the `variables` object. [page:1]

## Delete a variable

Delete a single variable: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation variableDelete($input: VariableDeleteInput!) {
      variableDelete(input: $input)
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "environmentId": "environment-id",
        "serviceId": "service-id",
        "name": "OLD_VARIABLE",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "input": { "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id", "name": "OLD_VARIABLE" } }` [page:1]

## Get rendered variables for deployment

Get all variables as they would appear during a deployment (with all references resolved): [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query variablesForServiceDeployment($projectId: String!, $environmentId: String!, $serviceId: String!) {
      variablesForServiceDeployment(
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
      )
    }`,
    variables: {
      "projectId": "project-id",
      "environmentId": "environment-id",
      "serviceId": "service-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id" }` [page:1]

## Variable references

Railway supports referencing variables from other services using the syntax: [page:1]

```txt
${{ServiceName.VARIABLE_NAME}}
```
[page:1]

For example, to reference a database URL from a Postgres service: [page:1]

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation variableUpsert($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "environmentId": "environment-id",
        "serviceId": "service-id",
        "name": "DATABASE_URL",
        "value": "${{Postgres.DATABASE_URL}}",
      },
    },
  }),
});

const data = await response.json();
console.log(data);
```
[page:1]

**Variables input:** [page:1]  
`{ "input": { "projectId": "project-id", "environmentId": "environment-id", "serviceId": "service-id", "name": "DATABASE_URL", "value": "${{Postgres.DATABASE_URL}}" } }` [page:1]

## Common patterns

### Copy variables between environments

- Fetch variables from source environment. [page:1]
- Upsert to target environment using `variableCollectionUpsert`. [page:1]

### Import from .env file

Parse your `.env` file and use `variableCollectionUpsert` to set all variables at once. [page:1]

### Rotate secrets

Use `variableUpsert` with `skipDeploys: true` for all services, then trigger deployments manually when ready. [page:1]
```