import React from "react";
import "./EditableTable.css";
import { EllipsisHorizontalCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function EditableTable({ columns = [], data = [] }) {
  const tableData = Array.isArray(data) ? data : [];
  const [checkedRows, setCheckedRows] = React.useState([]);
  const [checkAll, setCheckAll] = React.useState(false);
  const getPercentWidth = (col) => {
    if (typeof col.width === 'number') return col.width + '%';
    if (typeof col.width === 'string' && col.width.endsWith('%')) return col.width;
    return '20%';
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

  return (
    <div className="users-table">
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
              <tr key={row.id ?? rowIdx} className={rowIdx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                <td className="table-cell checkbox-cell">
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
                    return (
                      <td key={col.key} className={col.cellClassName} style={{ width: getPercentWidth(col) }}>
                        <span className={`status-cell ${row.status?.toLowerCase() || ''}`}>
                          <span className={`status-circle ${row.status?.toLowerCase() || ''}`}></span>
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
                <td className="table-cell actions">
                  <button className="action-button"><EllipsisHorizontalCircleIcon /></button>
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