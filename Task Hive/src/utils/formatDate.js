export function formatDateWithPreference(isoDate, dateFormat = "MM/DD/YYYY") {
    if (!isoDate) return null;
    const d = new Date(`${isoDate}T00:00:00`);
    if (isNaN(d.getTime())) return null;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    switch (dateFormat) {
        case "DD/MM/YYYY": return `${day}/${month}/${year}`;
        case "YYYY/MM/DD": return `${year}/${month}/${day}`;
        case "MM/DD/YYYY":
        default: return `${month}/${day}/${year}`;
    }
}
