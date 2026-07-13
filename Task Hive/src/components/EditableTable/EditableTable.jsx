import React from "react";
import "./EditableTable.css";
import { CheckIcon, TrashIcon, InboxIcon, ClockIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import EmptyState from "../EmptyState/EmptyState";

// Inline (not <img>) so `currentColor` picks up each status pill's color.
function SealCheckIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.1163 6.42625C13.8806 6.18 13.6369 5.92625 13.545 5.70312C13.46 5.49875 13.455 5.16 13.45 4.83187C13.4406 4.22187 13.4306 3.53062 12.95 3.05C12.4694 2.56937 11.7781 2.55937 11.1681 2.55C10.84 2.545 10.5012 2.54 10.2969 2.455C10.0744 2.36312 9.82 2.11937 9.57375 1.88375C9.1425 1.46937 8.6525 1 8 1C7.3475 1 6.85812 1.46937 6.42625 1.88375C6.18 2.11937 5.92625 2.36312 5.70312 2.455C5.5 2.54 5.16 2.545 4.83187 2.55C4.22187 2.55937 3.53062 2.56937 3.05 3.05C2.56937 3.53062 2.5625 4.22187 2.55 4.83187C2.545 5.16 2.54 5.49875 2.455 5.70312C2.36312 5.92562 2.11937 6.18 1.88375 6.42625C1.46937 6.8575 1 7.3475 1 8C1 8.6525 1.46937 9.14187 1.88375 9.57375C2.11937 9.82 2.36312 10.0738 2.455 10.2969C2.54 10.5012 2.545 10.84 2.55 11.1681C2.55937 11.7781 2.56937 12.4694 3.05 12.95C3.53062 13.4306 4.22187 13.4406 4.83187 13.45C5.16 13.455 5.49875 13.46 5.70312 13.545C5.92562 13.6369 6.18 13.8806 6.42625 14.1163C6.8575 14.5306 7.3475 15 8 15C8.6525 15 9.14187 14.5306 9.57375 14.1163C9.82 13.8806 10.0738 13.6369 10.2969 13.545C10.5012 13.46 10.84 13.455 11.1681 13.45C11.7781 13.4406 12.4694 13.4306 12.95 12.95C13.4306 12.4694 13.4406 11.7781 13.45 11.1681C13.455 10.84 13.46 10.5012 13.545 10.2969C13.6369 10.0744 13.8806 9.82 14.1163 9.57375C14.5306 9.1425 15 8.6525 15 8C15 7.3475 14.5306 6.85812 14.1163 6.42625ZM10.8538 6.85375L7.35375 10.3538C7.30731 10.4002 7.25217 10.4371 7.19147 10.4623C7.13077 10.4874 7.06571 10.5004 7 10.5004C6.93429 10.5004 6.86923 10.4874 6.80853 10.4623C6.74783 10.4371 6.69269 10.4002 6.64625 10.3538L5.14625 8.85375C5.05243 8.75993 4.99972 8.63268 4.99972 8.5C4.99972 8.36732 5.05243 8.24007 5.14625 8.14625C5.24007 8.05243 5.36732 7.99972 5.5 7.99972C5.63268 7.99972 5.75993 8.05243 5.85375 8.14625L7 9.29313L10.1462 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3692 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6914 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375Z" fill="currentColor" />
    </svg>
  );
}

// Inline (not <img>) so `currentColor` follows the action button's color.
function DotsVerticalCircleIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.125 10C18.125 8.39303 17.6485 6.82214 16.7557 5.48599C15.8629 4.14984 14.594 3.10844 13.1093 2.49348C11.6247 1.87852 9.99099 1.71761 8.41489 2.03112C6.8388 2.34462 5.39106 3.11846 4.25476 4.25476C3.11846 5.39106 2.34462 6.8388 2.03112 8.41489C1.71761 9.99099 1.87852 11.6247 2.49348 13.1093C3.10844 14.594 4.14984 15.8629 5.48599 16.7557C6.82214 17.6485 8.39303 18.125 10 18.125C12.1541 18.1223 14.2191 17.2654 15.7423 15.7423C17.2654 14.2191 18.1223 12.1541 18.125 10ZM9.0625 6.5625C9.0625 6.37708 9.11748 6.19582 9.2205 6.04165C9.32351 5.88748 9.46993 5.76732 9.64123 5.69636C9.81254 5.62541 10.001 5.60684 10.1829 5.64301C10.3648 5.67919 10.5318 5.76848 10.6629 5.89959C10.794 6.0307 10.8833 6.19775 10.9195 6.3796C10.9557 6.56146 10.9371 6.74996 10.8661 6.92127C10.7952 7.09257 10.675 7.23899 10.5208 7.342C10.3667 7.44502 10.1854 7.5 10 7.5C9.75136 7.5 9.5129 7.40123 9.33709 7.22541C9.16127 7.0496 9.0625 6.81114 9.0625 6.5625ZM9.0625 10C9.0625 9.81458 9.11748 9.63332 9.2205 9.47915C9.32351 9.32498 9.46993 9.20482 9.64123 9.13386C9.81254 9.06291 10.001 9.04434 10.1829 9.08051C10.3648 9.11669 10.5318 9.20598 10.6629 9.33709C10.794 9.4682 10.8833 9.63525 10.9195 9.8171C10.9557 9.99896 10.9371 10.1875 10.8661 10.3588C10.7952 10.5301 10.675 10.6765 10.5208 10.7795C10.3667 10.8825 10.1854 10.9375 10 10.9375C9.75136 10.9375 9.5129 10.8387 9.33709 10.6629C9.16127 10.4871 9.0625 10.2486 9.0625 10ZM9.0625 13.4375C9.0625 13.2521 9.11748 13.0708 9.2205 12.9167C9.32351 12.7625 9.46993 12.6423 9.64123 12.5714C9.81254 12.5004 10.001 12.4818 10.1829 12.518C10.3648 12.5542 10.5318 12.6435 10.6629 12.7746C10.794 12.9057 10.8833 13.0727 10.9195 13.2546C10.9557 13.4365 10.9371 13.625 10.8661 13.7963C10.7952 13.9676 10.675 14.114 10.5208 14.217C10.3667 14.32 10.1854 14.375 10 14.375C9.75136 14.375 9.5129 14.2762 9.33709 14.1004C9.16127 13.9246 9.0625 13.6861 9.0625 13.4375Z" fill="currentColor" />
    </svg>
  );
}

const STATUS_ICONS = {
  active: SealCheckIcon,
  invited: ClockIcon,
  suspended: NoSymbolIcon,
};

export default function EditableTable({
  columns = [],
  data = [],
  onRowClick,
  onRowAction,
  onBulkDelete,
  emptyIcon = InboxIcon,
  emptyTitle = "Nothing here yet",
  emptyDescription = "",
}) {
  const tableData = Array.isArray(data) ? data : [];
  const [checkedRows, setCheckedRows] = React.useState([]);
  const [checkAll, setCheckAll] = React.useState(false);

  if (tableData.length === 0) {
    return (
      <div className="users-table">
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }
  const getPercentWidth = (col) => {
    if (typeof col.width === 'number') return col.width + '%';
    if (typeof col.width === 'string' && col.width.endsWith('%')) return col.width;
    return '20%';
  };
  const clearSelection = () => {
    setCheckedRows([]);
    setCheckAll(false);
  };
  const handleCheckAll = (e) => {
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      setCheckedRows(tableData.map((row, idx) => row.id ?? idx));
    } else {
      setCheckedRows([]);
    }
  };
  const handleCheckRow = (rowIdOrIdx) => {
    setCheckedRows((prev) =>
      prev.includes(rowIdOrIdx)
        ? prev.filter((id) => id !== rowIdOrIdx)
        : [...prev, rowIdOrIdx]
    );
  };
  const handleBulkDelete = () => {
    if (!onBulkDelete || checkedRows.length === 0) return;
    onBulkDelete(checkedRows);
    clearSelection();
  };

  return (
    <div className="users-table">
    {onBulkDelete && checkedRows.length > 0 && (
      <div className="table-selection-toolbar">
        <span>{checkedRows.length} selected</span>
        <div className="table-selection-actions">
          <button type="button" className="table-selection-clear" onClick={clearSelection}>Clear</button>
          <button type="button" className="table-selection-delete" onClick={handleBulkDelete}>
            <TrashIcon className="table-selection-delete-icon" />
            Delete
          </button>
        </div>
      </div>
    )}
    <div className="editable-table-wrapper" style={{ overflowX: "auto" }}>
      <table className="users-table-element">
        <thead>
          <tr>
            <th className="table-header-cell checkbox-header">
              <div className="header-radius-left checkbox-wrapper">
                <input
                  type="checkbox"
                  className="table-checkbox"
                  checked={checkAll}
                  onChange={handleCheckAll}
                />
                {checkAll && (
                  <CheckIcon className="checkbox-checkmark" />
                )}
              </div>
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.headerClassName}
                style={{ width: getPercentWidth(col) }}
              >
                <div className="header-main">
                  {col.label}
                </div>
              </th>
            ))}
            <th className="table-header-cell actions-header">
              <div className="header-radius-right">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => {
            return (
              <tr
                key={row.id ?? rowIdx}
                className={`${rowIdx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}${onRowClick ? ' table-row-clickable' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                <td className="table-cell checkbox-cell" onClick={(e) => e.stopPropagation()}>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={checkedRows.includes(row.id ?? rowIdx)}
                      onChange={() => handleCheckRow(row.id ?? rowIdx)}
                    />
                    {checkedRows.includes(row.id ?? rowIdx) && (
                      <CheckIcon className="checkbox-checkmark" />
                    )}
                  </div>
                </td>
                {columns.map((col) => {
                  if (col.key === 'member') {
                    return (
                      <td key={col.key} className={col.cellClassName} style={{ width: getPercentWidth(col) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={row.img} alt={row.member} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', margin: 0 }} />
                          {row[col.key]}
                        </div>
                      </td>
                    );
                  }
                  if (col.key === 'status') {
                    const StatusIcon = STATUS_ICONS[row.status?.toLowerCase()] || SealCheckIcon;
                    return (
                      <td key={col.key} className={col.cellClassName} style={{ width: getPercentWidth(col) }}>
                        <span
                          className={`status-cell ${row.status?.toLowerCase() || ''}`}
                          style={row.statusColor ? { color: row.statusColor, background: `${row.statusColor}1a`, borderColor: row.statusColor } : undefined}
                        >
                          <StatusIcon className="status-cell-icon" />
                          {row[col.key]}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={col.key} className={col.cellClassName} style={{ width: getPercentWidth(col) }}>
                      {row[col.key]}
                    </td>
                  );
                })}
                <td className="table-cell actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="action-button"
                    onClick={() => (onRowAction || onRowClick)?.(row)}
                  >
                    <DotsVerticalCircleIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}