import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Teams.css'
import { IconButton, OutlineButton } from "../../components/Buttons/Buttons"
import { PlusCircleIcon, FunnelIcon } from "@heroicons/react/24/outline";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import Chance from 'chance';

const chance = new Chance(42);

function createData(id) {
  return {
    id,
    firstName: chance.first(),
    lastName: chance.last(),
    age: chance.age(),
    phone: chance.phone(),
    state: chance.state({ full: true }),
  };
}

const columns = [
  {
    width: 100,
    label: 'First Name',
    dataKey: 'firstName',
  },
  {
    width: 100,
    label: 'Last Name',
    dataKey: 'lastName',
  },
  {
    width: 50,
    label: 'Age',
    dataKey: 'age',
    numeric: true,
  },
  {
    width: 110,
    label: 'State',
    dataKey: 'state',
  },
  {
    width: 130,
    label: 'Phone Number',
    dataKey: 'phone',
  },
];

const rows = Array.from({ length: 200 }, (_, index) => createData(index));

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

export default function Teams() {
    return (
        <div className="teams-page">
            <Sidebar />
            <div className="teams-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
                <div className="teams-main">
                    <div className="team-top-content">
                    <h2>Teams Page</h2>
                    <div className="top-buttons">
                    <IconButton 
                        icon={PlusCircleIcon}
                        text="Add Team"
                        className="Add-Task"
                    />
                    <OutlineButton 
                        icon={FunnelIcon}
                        text="Filter"
                        className="Manage-Teams"
                    />
                    </div>
                    </div>

                    <div className="teams-table-container">
                    <TableVirtuoso
                      data={rows}
                      components={VirtuosoTableComponents}
                      fixedHeaderContent={() => (
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.dataKey}
                              style={{ width: column.width }}
                              align={column.numeric ? 'right' : 'left'}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      )}
                      itemContent={(index, row) => (
                        <>
                          {columns.map((column) => (
                            <TableCell
                              key={column.dataKey}
                              style={{ width: column.width }}
                              align={column.numeric ? 'right' : 'left'}
                            >
                              {row[column.dataKey]}
                            </TableCell>
                          ))}
                        </>
                      )}
                    />  
                </div>
            </div>
        </div>
        </div>    
    )
}