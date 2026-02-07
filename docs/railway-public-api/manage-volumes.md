Here’s the main content in cleaner Markdown form: [docs.railway](https://docs.railway.com/integrations/api/manage-volumes)

```markdown
# Manage Volumes with the Public API

Here are examples to help you manage persistent volumes using the Public API.

## Get project volumes

List all volumes in a project:

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
        volumes {
          edges {
            node {
              id
              name
              createdAt
            }
          }
        }
      }
    }`,
    variables: {
      "id": "project-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "id": "project-id" }
```

## Get volume instance details

Get details about a volume instance (volume in a specific environment):

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query volumeInstance($id: String!) {
      volumeInstance(id: $id) {
        id
        mountPath
        currentSizeMB
        state
        volume {
          id
          name
        }
        serviceInstance {
          serviceName
        }
      }
    }`,
    variables: {
      "id": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "id": "volume-instance-id" }
```

## Create a volume

Create a new persistent volume attached to a service:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeCreate($input: VolumeCreateInput!) {
      volumeCreate(input: $input) {
        id
        name
      }
    }`,
    variables: {
      "input": {
        "projectId": "project-id",
        "serviceId": "service-id",
        "mountPath": "/data"
      }
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
    "serviceId": "service-id",
    "mountPath": "/data"
  }
}
```

## Update a volume

Rename a volume:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeUpdate($volumeId: String!, $input: VolumeUpdateInput!) {
      volumeUpdate(volumeId: $volumeId, input: $input) {
        id
        name
      }
    }`,
    variables: {
      "volumeId": "volume-id",
      "input": {
        "name": "database-storage"
      }
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "volumeId": "volume-id",
  "input": {
    "name": "database-storage"
  }
}
```

## Update volume instance

Update the mount path for a volume instance:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeInstanceUpdate($volumeId: String!, $input: VolumeInstanceUpdateInput!) {
      volumeInstanceUpdate(volumeId: $volumeId, input: $input)
    }`,
    variables: {
      "volumeId": "volume-id",
      "input": {
        "mountPath": "/new/path"
      }
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "volumeId": "volume-id",
  "input": {
    "mountPath": "/new/path"
  }
}
```

## Delete a volume

This will permanently delete the volume and all its data.

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeDelete($volumeId: String!) {
      volumeDelete(volumeId: $volumeId)
    }`,
    variables: {
      "volumeId": "volume-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "volumeId": "volume-id" }
```

## Volume backups

### List backups

Get all backups for a volume instance:

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query volumeInstanceBackupList($volumeInstanceId: String!) {
      volumeInstanceBackupList(volumeInstanceId: $volumeInstanceId) {
        id
        name
        createdAt
        expiresAt
        usedMB
        referencedMB
      }
    }`,
    variables: {
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "volumeInstanceId": "volume-instance-id" }
```

### Create a backup

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
      volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
    }`,
    variables: {
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "volumeInstanceId": "volume-instance-id" }
```

### Restore from backup

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeInstanceBackupRestore($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
      volumeInstanceBackupRestore(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
    }`,
    variables: {
      "volumeInstanceBackupId": "backup-id",
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "volumeInstanceBackupId": "backup-id",
  "volumeInstanceId": "volume-instance-id"
}
```

### Lock a backup (prevent expiration)

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeInstanceBackupLock($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
      volumeInstanceBackupLock(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
    }`,
    variables: {
      "volumeInstanceBackupId": "backup-id",
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "volumeInstanceBackupId": "backup-id",
  "volumeInstanceId": "volume-instance-id"
}
```

### Delete a backup

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation volumeInstanceBackupDelete($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
      volumeInstanceBackupDelete(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
    }`,
    variables: {
      "volumeInstanceBackupId": "backup-id",
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{
  "volumeInstanceBackupId": "backup-id",
  "volumeInstanceId": "volume-instance-id"
}
```

## Backup schedules

### List backup schedules

```js
const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query volumeInstanceBackupScheduleList($volumeInstanceId: String!) {
      volumeInstanceBackupScheduleList(volumeInstanceId: $volumeInstanceId) {
        id
        name
        cron
        kind
        retentionSeconds
        createdAt
      }
    }`,
    variables: {
      "volumeInstanceId": "volume-instance-id"
    },
  }),
});

const data = await response.json();
console.log(data);
```

Variables:

```json
{ "volumeInstanceId": "volume-instance-id" }
```

## Common mount paths

| Use Case        | Recommended Mount Path        |
|-----------------|------------------------------|
| PostgreSQL      | `/var/lib/postgresql/data`   |
| MySQL           | `/var/lib/mysql`             |
| MongoDB         | `/data/db`                   |
| Redis           | `/data`                      |
| General Storage | `/data` or `/app/data`       |
```