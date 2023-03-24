import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FileReference } from './models';
import { formatBytes } from './utils';
import { styled } from '@mui/material';

interface TableProps {
    rows: FileReference[];
}

const TableCellHeader = styled(TableCell)(() => ({
  fontWeight: 'bold'
}))

export default function ImageTable(props: TableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCellHeader>Count</TableCellHeader>
            <TableCellHeader align="right">Total Space</TableCellHeader>
            <TableCellHeader align="right">Path</TableCellHeader>
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
  