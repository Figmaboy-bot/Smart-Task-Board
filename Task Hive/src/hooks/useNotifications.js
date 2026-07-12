import { useMemo } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const UPCOMING_WINDOW_DAYS = 3;
const MAX_NOTIFICATIONS = 8;

function daysUntil(dueDateIso, today) {
    const due = new Date(`${dueDateIso}T00:00:00`);
    return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);
}

// Derives notifications live from the current task list rather than a
// persisted table, since every case here (overdue / due today / due soon)
// is reconstructable from a task's own due_date at read time.
// `tick` is an optional cache-buster (e.g. a counter incremented on a
// timer) so callers doing periodic re-checks (toast popups) can force this
// to recompute even when `tasks` itself hasn't changed - a task can cross
// from "due in 3 days" to "due today" purely because the clock moved on.
export function useNotifications(tasks, preferences = {}, tick = 0) {
    const { notify_due_date: notifyDueDate = true, silence_non_urgent: silenceNonUrgent = false } = preferences;

    return useMemo(() => {
        if (!notifyDueDate) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const myOpenTasks = tasks.filter(t => t.user?.name === "Me" && t.due_date && t.columnTitle !== "DONE");

        const items = myOpenTasks
            .map(task => {
                const diff = daysUntil(task.due_date, today);
                if (diff < 0) {
                    const days = -diff;
                    return {
                        id: task.id,
                        type: "error",
                        title: "Task overdue",
                        desc: `"${task.title}" was due ${task.date}`,
                        time: days === 1 ? "1 day overdue" : `${days} days overdue`,
                        rank: 0,
                        diff,
                    };
                }
                if (diff === 0) {
                    return {
                        id: task.id,
                        type: "warning",
                        title: "Due today",
                        desc: `"${task.title}" is due today`,
                        time: "Today",
                        rank: 1,
                        diff,
                    };
                }
                if (diff <= UPCOMING_WINDOW_DAYS) {
                    return {
                        id: task.id,
                        type: "grey",
                        title: "Upcoming deadline",
                        desc: `"${task.title}" is due in ${diff} day${diff > 1 ? "s" : ""}`,
                        time: `In ${diff}d`,
                        rank: 2,
                        diff,
                    };
                }
                return null;
            })
            .filter(Boolean)
            .filter((item) => !silenceNonUrgent || item.rank === 0)
            .sort((a, b) => a.rank - b.rank || a.diff - b.diff)
            .slice(0, MAX_NOTIFICATIONS);

        return items;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks, notifyDueDate, silenceNonUrgent, tick]);
}
