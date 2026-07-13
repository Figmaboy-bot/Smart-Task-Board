// Messages now live in a shared MessagesProvider
// (src/context/MessagesContext.jsx) so every consumer - the Messages page's
// live list and RealtimeNotifications' new-message toast - reads the same
// data over a single realtime channel instead of each opening its own. This
// file is kept as a re-export so existing
// `import { useMessages } from "../../hooks/useMessages"` call sites don't
// need to change.
export { useMessages } from "../context/MessagesContext";
