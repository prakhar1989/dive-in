import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FileReference } from './models';
import { formatBytes } from './utils';

interface TableProps {
    rows: FileReference[];
}

export default function ImageTable(props: TableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Count</TableCell>
            <TableCell align="right">Total Space</TableCell>
            <TableCell align="right">Path</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.count}</TableCell>
              <TableCell align="right">
                {formatBytes(row.sizeBytes)}
              </TableCell>
              <TableCell align="right">{row.file}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
  