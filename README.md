# Splatoon2 Video Index Frontend
## Architecture
```
                 +---------------+
+----------+     |      +------+ |     +-----+
| Frontend |-----| API  | Core | |-----| RDB |
+----------+     |      + -----+ |     +-----+
                 +---------------+
                         |
                   +-----------+
                   | Scheduler |
                   +-----------+
```

- Frontend
    - [Repo]()
    - React
- API
    - [Repo]()
    - ASP.NET
- Core
    - [Repo]()
    - C#
- RDB
    - MySQL
- Scheduler
    - [Repo]()
    - C#
    - Azure functions

## Development
```
$Env:REACT_APP_SERVER_URL="https://localhost:5050"
npm start
```