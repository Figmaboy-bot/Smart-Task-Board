// Team members now live in a shared TeamMembersProvider
// (src/context/TeamMembersContext.jsx) so every page reads the same live
// list. This file is kept as a re-export so existing
// `import { useTeamMembers } from "../../hooks/useTeamMembers"` call sites
// don't need to change.
export { useTeamMembers } from "../context/TeamMembersContext";
