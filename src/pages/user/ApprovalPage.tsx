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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface ApprovalItem {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'returned' | 'rejected';
  submittedBy: string;
  date: string;
}

interface ConfirmDialogState {
  open: boolean;
  itemId: string;
  action: 'approve' | 'return' | 'reject' | null;
}

function ApprovalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    itemId: '',
    action: null,
  });
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

  const handleConfirmOpen = (id: string, action: 'approve' | 'return' | 'reject') => {
    setConfirmDialog({
      open: true,
      itemId: id,
      action,
    });
  };

  const handleConfirmClose = () => {
    setConfirmDialog({
      open: false,
      itemId: '',
      action: null,
    });
  };

  const handleConfirm = () => {
    if (!confirmDialog.action || !confirmDialog.itemId) return;

    switch (confirmDialog.action) {
      case 'approve':
        setItems(items.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'approved' } : item
        ));
        break;
      case 'return':
        setItems(items.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'returned' } : item
        ));
        break;
      case 'reject':
        setItems(items.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'rejected' } : item
        ));
        break;
    }

    handleConfirmClose();
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'returned':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDialogContent = () => {
    const item = items.find(i => i.id === confirmDialog.itemId);
    if (!item) return '';

    switch (confirmDialog.action) {
      case 'approve':
        return `Are you sure you want to approve "${item.title}"?`;
      case 'return':
        return `Are you sure you want to return "${item.title}"?`;
      case 'reject':
        return `Are you sure you want to reject "${item.title}"?`;
      default:
        return '';
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
                            onClick={() => handleConfirmOpen(item.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleConfirmOpen(item.id, 'return')}
                          >
                            Return
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleConfirmOpen(item.id, 'reject')}
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

        <Dialog
          open={confirmDialog.open}
          onClose={handleConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm Action
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {getDialogContent()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              color="primary"
              variant="contained"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ApprovalPage