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
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  InputLabel,
  Select,
  FormControl
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
  const [status, setStatus] = useState<string | "">("");
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
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'returned', label: 'Returned' }
  ];

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

  const filteredItems = items.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUser = item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = status ? item.status === status : true;
      return (matchTitle || matchUser) && matchStatus;
  });

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
    <Box sx={{ height: "fit-content", bgcolor: '#f5f5f5', overflowY: 'scroll', py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box className="flex gap-4" sx={{ marginBottom: '10px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or submitter name..."
            sx={{ width: { xs: "100%", sm: "250px", md: "400px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            size="medium"
            sx={{ minWidth: { xs: "100%", sm: "150px" } }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                borderRadius: "4px",
                "& .MuiSelect-select": {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted By</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
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
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
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