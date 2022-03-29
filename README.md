# Splatoon2 Video Index Frontend
```
                 +---------------+
+----------+     |      +------+ |     +-----+
| Frontend |-----| API  | Core | |-----| RDB |
+----------+     |      + -----+ |     +-----+
                 +---------------+
                         |
              +---------------------+
              |            +------+ |
              | Scheduler  | Core | |
              |            + -----+ |
              +---------------------+
```

- Frontend (here)
    - [Repo](https://github.com/tetsis/splatoon2-video-index-frontend)
    - React
    - Deployed in [vercel](https://vercel.com/)
        - [page](https://splatoon2-video-index.vercel.app)
- API
    - [Repo](https://github.com/tetsis/splatoon2-video-index-api) (private)
    - ASP.NET
- Core
    - [Repo](https://github.com/tetsis/splatoon2-video-index-core)
    - C#
- RDB
    - MySQL
- Scheduler
    - [Repo](https://github.com/tetsis/splatoon2-video-index-scheduler)
    - C#
    - Azure functions

## Development
```
$Env:REACT_APP_SERVER_URL="https://localhost:5050"
npm install (first time only)
npm start
```