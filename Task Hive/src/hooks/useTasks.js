// Tasks now live in a shared TasksProvider (src/context/TasksContext.jsx) so
// every page and the Header read the same live task list. This file is kept
// as a re-export so existing `import { useTasks } from "../../hooks/useTasks"`
// call sites don't need to change.
export { useTasks, PRIORITY_COLOR, STATUS_TO_COLUMN, COLUMN_TO_STATUS } from "../context/TasksContext";
