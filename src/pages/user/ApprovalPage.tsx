import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Chip,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface ApprovalItem {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  date: string;
}

function ApprovalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ApprovalItem[]>([
    {
      id: '1',
      title: 'Project Proposal A',
      status: 'pending',
      submittedBy: 'John Doe',
      date: '2025-01-15',
    },
    {
      id: '2',
      title: 'Budget Request B',
      status: 'pending',
      submittedBy: 'Jane Smith',
      date: '2025-01-16',
    },
    {
      id: '3',
      title: 'Budget Request C',
      status: 'pending',
      submittedBy: 'Alex Brown',
      date: '2025-01-16',
    },
    {
      id: '4',
      title: 'Salary Request D',
      status: 'pending',
      submittedBy: 'Tom Cruise',
      date: '2025-01-17',
    },
    {
      id: '5',
      title: 'Project Proposal E',
      status: 'pending',
      submittedBy: 'Mary Jane',
      date: '2025-01-17',
    },
  ]);

  const handleApprove = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleReject = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box sx={{height: "fit-content", bgcolor: '#f5f5f5', overflowY:'scroll', py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Approval Dashboard
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or submitter name..."
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No items found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.submittedBy}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        color={getStatusChipColor(item.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {item.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(item.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default ApprovalPage