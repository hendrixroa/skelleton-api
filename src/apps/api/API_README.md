### Authentication

N/A (yet)

### Success responses
HTTP status = 2xx

```
{
  data: { ... }
}
```

by convention for paginated endpoint:

```
{
  data: { items: [], meta: { count, limit, offset } }
}
```

### Error responses

HTTP status = 4xx/5xx

```
{
  error: {
    message: 'Error message',
    reasons: [
      { path: '<field_path>', message: 'Field error message', reason: '<reasonCode>' },
      ...
    ],
    severity: 'error' | 'warning',
    type: 'authentication' | 'validation' | 'internal',
  }
}
```

* status 401 - type = 'authentication'
* status 400 - type = 'validation'
* status 5xx - type = 'internal'
