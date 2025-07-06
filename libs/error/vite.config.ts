import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "error",
            fileName: "index",
            formats: ["es", "cjs"],
        },
    },
})

export default config
