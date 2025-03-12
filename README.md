# GraphQL Ops Counter Demonstration

This is a test to see if GraphQL produces the expected amount of requests for a given query.

To run locally:

1. Clone the repo
1. `cd` into directory and install dependencies via `pnpm i`
1. `cp .env.example .env`
1. `pnpm dev`

Then, once it's running, you can hit the `http://localhost:3000/api/test-graphql` endpoint to perform a test query.

The `opsCounter` plugin is configured to allow a max of 15 queries, but warn at 12. You'll see that as expected, there are 12 queries made for the GraphQL query that is run.
