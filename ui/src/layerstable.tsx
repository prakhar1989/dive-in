import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DiveLayer } from './models';
import { formatBytes, extractId } from './utils';

interface TableProps {
    rows: DiveLayer[];
}

export default function LayersTable(props: TableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight: 'bold'}}>Index</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Size</TableCell>
            <TableCell sx={{fontWeight: 'bold'}} align="right">Command</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.index}</TableCell>
              <TableCell>{extractId(row.id)}</TableCell>
              <TableCell>{formatBytes(row.sizeBytes)}</TableCell>
              <TableCell align="right">{row.command.substring(0, 100)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
  