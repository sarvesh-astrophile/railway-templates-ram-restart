```markdown
# Manage Projects with the Public API

Here are examples to help you manage your projects using the Public API.

---

## List all projects

Fetch all projects in your personal account:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query {
      projects {
        edges {
          node {
            id
            name
            description
            createdAt
            updatedAt
          }
        }
      }
    }`,
  }),
});

const data = await response.json();
console.log(data);
```

---

## List projects in a workspace

Fetch all projects in a specific workspace:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query workspaceProjects($workspaceId: String!) {
      projects(workspaceId: $workspaceId) {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }`,
    variables: {
      "workspaceId": "workspace-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "workspaceId": "workspace-id"
}
```

---

## Get a single project

Fetch a project by ID with its services and environments:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query project($id: String!) {
      project(id: $id) {
        id
        name
        description
        createdAt
        services {
          edges {
            node {
              id
              name
              icon
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
    }`,
    variables: {
      "id": "project-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "id": "project-id"
}
```

---

## Create a project

Create a new empty project:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation projectCreate($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "name": "My New Project",
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
    "name": "My New Project"
  }
}
```

Optional fields (6 available):

- `input.description` (String) – Project description  
- `input.workspaceId` (String) – Create in a specific workspace  
- `input.isPublic` (Boolean) – Make project publicly visible. Default: `false`  
- `input.prDeploys` (Boolean) – Enable PR deploy environments. Default: `false`  
- `input.defaultEnvironmentName` (String) – Name for default environment. Default: `production`  
- `input.repo` (ProjectCreateRepo) – Connect to a GitHub repository  

---

## Update a project

Update project name or description:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation projectUpdate($id: String!, $input: ProjectUpdateInput!) {
      projectUpdate(id: $id, input: $input) {
        id
        name
        description
      }
    }`,
    variables: {
      "id": "project-id",
      "input": {
        "name": "Updated Project Name",
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
  "id": "project-id",
  "input": {
    "name": "Updated Project Name"
  }
}
```

Optional fields (3 available):

- `input.description` (String) – Project description  
- `input.isPublic` (Boolean) – Make project publicly visible. Default: `false`  
- `input.prDeploys` (Boolean) – Enable PR deploy environments. Default: `false`  

---

## Delete a project

This is a destructive action and cannot be undone.

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation projectDelete($id: String!) {
      projectDelete(id: $id)
    }`,
    variables: {
      "id": "project-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "id": "project-id"
}
```

---

## Transfer a project to a workspace

Transfer a project to a different workspace:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation projectTransfer($projectId: String!, $input: ProjectTransferInput!) {
      projectTransfer(projectId: $projectId, input: $input)
    }`,
    variables: {
      "projectId": "project-id",
      "input": {
        "workspaceId": "target-workspace-id",
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
  "projectId": "project-id",
  "input": {
    "workspaceId": "target-workspace-id"
  }
}
```

---

## Get project members

List all members of a project:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query projectMembers($projectId: String!) {
      projectMembers(projectId: $projectId) {
        id
        role
        user {
          id
          name
          email
        }
      }
    }`,
    variables: {
      "projectId": "project-id",
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "projectId": "project-id"
}
```
```