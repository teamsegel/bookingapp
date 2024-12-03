import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  experimentalParser: true,
  client: "@hey-api/client-fetch",
  input: "http://localhost:8000/openapi.json",
  output: {
    path: "./src/client",
  },
});
