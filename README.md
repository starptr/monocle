# monocle

A friendly self-hosted webapp for interacting with PostgreSQL servers.

## Usage

Currently, the Monocle backend does not verify the identity of any Monocle clients. So, you have to start up both an instance of the backend and the frontend so that bad actors can't arbitrarily query your databases.

1. Run `yarn install`.
2. Build both the backend and the frontend with `yarn full-build`.
3. Start the app with `yarn full-start` and access the url outputted on the screen (usually `localhost:5000`).

![image](https://user-images.githubusercontent.com/10691605/123745372-0c9f6000-d865-11eb-9d12-92164afe6633.png)
