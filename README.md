# `@lucid-softworks/once`

Wrap a function so it runs at most once. Later calls replay the first returned
value or the exact thrown error.

```ts
import { once } from "@lucid-softworks/once";

const connect = once(() => ({ connected: true }));

connect(); // creates the connection
connect(); // returns the same connection
```

Arguments and return types are preserved. Re-entrant calls are rejected to
maintain the at-most-once guarantee.
