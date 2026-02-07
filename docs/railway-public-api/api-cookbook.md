Here is the main content converted to clean Markdown (navigation chrome removed): [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

# API Cookbook

This cookbook provides quick copy-paste examples for common API operations. For detailed explanations, see the linked guides. [docs.railway](https://docs.railway.com/guides/api-cookbook)

**GraphQL Endpoint:**  
`https://backboard.railway.com/graphql/v2` [docs.railway](https://docs.railway.com/guides/api-cookbook)

**Authentication:** [docs.railway](https://docs.railway.com/guides/api-cookbook)

```bash
# Set your token (get one from railway.com/account/tokens)
export RAILWAY_TOKEN="your-token"
```

Test your connection: [docs.railway](https://docs.railway.com/guides/api-cookbook)

### Test `me` query (JavaScript)

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query {
        me {
          id
          name
          email
        }
      }
    `,
  }),
});

const { data, errors } = await response.json();
```

See [Manage Projects](https://docs.railway.com/guides/manage-projects). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## List All Projects

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query {
        projects {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
  }),
});

const { data, errors } = await response.json();
```

***

## Get Project with Services

Required: **ID** = `"project-id"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query project($id: String!) {
        project(id: $id) {
          id
          name
          services {
            edges {
              node {
                id
                name
              }
            }
          }
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `,
    variables: {
      id: "project-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Create a Project

Required: **Name** = `"My Project"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation projectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        name: "My Project",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (5 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

See [Manage Services](https://docs.railway.com/guides/manage-services). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Create Service from GitHub

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Name** = `"API"`  
- **Repo** = `"username/repo"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation serviceCreate($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        name: "API",
        source: {
          repo: "username/repo",
        },
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (3 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Create Service from Docker Image

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Name** = `"Ubuntu"`  
- **Image** = `"ubuntu"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation serviceCreate($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        name: "Ubuntu",
        source: {
          image: "ubuntu",
        },
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (2 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Update Service Settings

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Service ID** = `"service-id"`  
- **Environment ID** = `"environment-id"`  
- **Start Command** = `"npm start"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation serviceInstanceUpdate(
        $serviceId: String!
        $environmentId: String!
        $input: ServiceInstanceUpdateInput!
      ) {
        serviceInstanceUpdate(
          serviceId: $serviceId
          environmentId: $environmentId
          input: $input
        )
      }
    `,
    variables: {
      serviceId: "service-id",
      environmentId: "environment-id",
      input: {
        startCommand: "npm start",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (7 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## List Recent Deployments

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Service ID** = `"service-id"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query deployments($input: DeploymentListInput!) {
        deployments(input: $input, first: 5) {
          edges {
            node {
              id
              status
              createdAt
            }
          }
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        serviceId: "service-id",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Get Deployment Logs

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Deployment ID** = `"deployment-id"`  
- **Limit** = `100`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query deploymentLogs($deploymentId: String!, $limit: Int) {
        deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
          timestamp
          message
          severity
        }
      }
    `,
    variables: {
      deploymentId: "deployment-id",
      limit: 100,
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Deploy

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Service ID** = `"service-id"`  
- **Environment ID** = `"environment-id"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation serviceInstanceDeploy(
        $serviceId: String!
        $environmentId: String!
      ) {
        serviceInstanceDeploy(
          serviceId: $serviceId
          environmentId: $environmentId
        )
      }
    `,
    variables: {
      serviceId: "service-id",
      environmentId: "environment-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Rollback

Required: **ID** = `"deployment-id"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation deploymentRollback($id: String!) {
        deploymentRollback(id: $id) {
          id
        }
      }
    `,
    variables: {
      id: "deployment-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Get Variables

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Environment ID** = `"environment-id"`  
- **Service ID** = `"service-id"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query variables(
        $projectId: String!
        $environmentId: String!
        $serviceId: String
      ) {
        variables(
          projectId: $projectId
          environmentId: $environmentId
          serviceId: $serviceId
        )
      }
    `,
    variables: {
      projectId: "project-id",
      environmentId: "environment-id",
      serviceId: "service-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Set Variables

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Environment ID** = `"environment-id"`  
- **Service ID** = `"service-id"`  
- **KEY1** = `"value1"`  
- **KEY2** = `"value2"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
        variableCollectionUpsert(input: $input)
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        environmentId: "environment-id",
        serviceId: "service-id",
        variables: {
          KEY1: "value1",
          KEY2: "value2",
        },
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (2 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## List Environments

Required: **Project ID** = `"project-id"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query environments($projectId: String!) {
        environments(projectId: $projectId) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    variables: {
      projectId: "project-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Create Environment

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Name** = `"staging"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation environmentCreate($input: EnvironmentCreateInput!) {
        environmentCreate(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        name: "staging",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (3 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Add Railway Domain

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Service ID** = `"service-id"`  
- **Environment ID** = `"environment-id"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
        serviceDomainCreate(input: $input) {
          domain
        }
      }
    `,
    variables: {
      input: {
        serviceId: "service-id",
        environmentId: "environment-id",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (1 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Add Custom Domain

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Environment ID** = `"environment-id"`  
- **Service ID** = `"service-id"`  
- **Domain** = `"api.example.com"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation customDomainCreate($input: CustomDomainCreateInput!) {
        customDomainCreate(input: $input) {
          id
          status {
            dnsRecords {
              hostlabel
              requiredValue
            }
          }
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        environmentId: "environment-id",
        serviceId: "service-id",
        domain: "api.example.com",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (1 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Create Volume

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Project ID** = `"project-id"`  
- **Service ID** = `"service-id"`  
- **Mount Path** = `"/data"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation volumeCreate($input: VolumeCreateInput!) {
        volumeCreate(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        projectId: "project-id",
        serviceId: "service-id",
        mountPath: "/data",
      },
    },
  }),
});

const { data, errors } = await response.json();
```

Optional fields (2 available). [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

## Create Backup

Required: **Volume Instance ID** = `"volume-instance-id"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
        volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
      }
    `,
    variables: {
      volumeInstanceId: "volume-instance-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## List TCP Proxies

Required: [docs.railway](https://docs.railway.com/guides/api-cookbook)
- **Service ID** = `"service-id"`  
- **Environment ID** = `"environment-id"`

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query tcpProxies($serviceId: String!, $environmentId: String!) {
        tcpProxies(serviceId: $serviceId, environmentId: $environmentId) {
          id
          domain
          proxyPort
          applicationPort
        }
      }
    `,
    variables: {
      serviceId: "service-id",
      environmentId: "environment-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Get Workspace

Required: **Workspace ID** = `"workspace-id"` [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query workspace($workspaceId: String!) {
        workspace(workspaceId: $workspaceId) {
          id
          name
          members {
            id
            name
            email
            role
          }
        }
      }
    `,
    variables: {
      workspaceId: "workspace-id",
    },
  }),
});

const { data, errors } = await response.json();
```

***

## Get Project Token Info

Use with a **project token**. [docs.railway](https://docs.railway.com/guides/api-cookbook)

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query {
        projectToken {
          projectId
          environmentId
        }
      }
    `,
  }),
});

const { data, errors } = await response.json();
```

***

## List Available Regions

### JavaScript

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      query {
        regions {
          name
          country
          location
        }
      }
    `,
  }),
});

const { data, errors } = await response.json();
```

***

## Tips

- Press `Cmd/Ctrl + K` in the Railway dashboard and search for “Copy Project ID”, “Copy Service ID”, or “Copy Environment ID”. [docs.railway](https://docs.railway.com/guides/api-cookbook)
- Perform actions in the Railway dashboard and inspect the browser network tab to see the exact GraphQL queries used. [docs.railway](https://docs.railway.com/guides/api-cookbook)
- Test queries interactively at <https://railway.com/graphiql>. [docs.railway](https://docs.railway.com/guides/api-cookbook)

***

If you want, I can trim this down to only specific sections (e.g. deployments, variables) or convert one block into a reusable code snippet template.