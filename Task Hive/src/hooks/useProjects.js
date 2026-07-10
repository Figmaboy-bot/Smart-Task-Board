// Projects now live in a shared ProjectsProvider (src/context/ProjectsContext.jsx)
// so every page reads the same live project list. This file is kept as a
// re-export so existing `import { useProjects } from "../../hooks/useProjects"`
// call sites don't need to change.
export { useProjects } from "../context/ProjectsContext";
