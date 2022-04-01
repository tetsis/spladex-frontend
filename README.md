# Spladex Frontend
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
    - [Repo](https://github.com/tetsis/spladex-frontend)
    - React
    - Deployed in [vercel](https://vercel.com/)
        - [page](https://spladex.jp)
- API
    - [Repo](https://github.com/tetsis/spladex-api) (private)
    - ASP.NET
- Core
    - [Repo](https://github.com/tetsis/spladex-core)
    - C#
- RDB
    - MySQL
- Scheduler
	- [Repo](https://github.com/tetsis/spladex-scheduler)
    - C#
    - Azure functions

## Development
```
$Env:REACT_APP_SERVER_URL="https://localhost:5050"
npm install (first time only)
npm start
```