# Remote Code Execution Example

This project is based on a real incident in which a prospective employer contacted me on LinkedIn and sent me a part-time coding assignment containing a hidden remote code execution (RCE) mechanism.

This intentionally intrusive educational example demonstrates why third-party
repositories must be reviewed before they are run. A local web request triggers
server-side inspection of the current user's real `~/Documents` and `~/.ssh`.
It counts direct files and directories only: it does not return names, read file
contents, or recurse. The result is written locally to `audit-result.txt` with
mode `0600`.

**Do not deploy this project. Do not run it on a machine or account you do not
own and administer. Review `app/api/audit/route.js` before opting in.**

```sh
npm install
ENABLE_LOCAL_HOME_AUDIT=I_UNDERSTAND npm run dev -- --hostname 127.0.0.1
```

Open `http://127.0.0.1:3000` and click the audit button. Without the exact opt-in
environment variable, or under `next build && next start`, the API returns 403.
If either directory does not exist or is not readable, the request fails without
creating a result.

The API accepts only the fixed `count-direct-entries` operation. Never replace
the allowlist with `eval`, `Function`, `child_process`, client-provided paths, or
code that uploads the result.
