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
    - [Repo](https://github.com/tetsis/splatoon2-video-index-frontend)
    - React
- API
    - [Repo](https://github.com/tetsis/splatoon2-video-index-api)
    - ASP.NET
- Core
    - [Repo](https://github.com/tetsis/splatoon2-video-index-core)
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