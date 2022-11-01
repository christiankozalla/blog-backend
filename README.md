# Blog Backend

I want to use this code in two separate blog instances, so I am extracting it to a stand-alone package here.

## Usage

In order to use this package, you must provide environment variables

| Environment Var | Description                             | Example                                          |
|-----------------|-----------------------------------------|--------------------------------------------------|
| `SESSION_NAME`  | Name for a session cookie               | `$ SESSION_NAME=FOO_BAR node server.js`          |
| `CMS_SECRET`    | Secret string to encrypt user passwords | `$ CMS_SECRET=long-secret-string node server.js` |