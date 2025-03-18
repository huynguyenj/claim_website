import React, { useState, useEffect } from 'react';
import authService from '../../services/AuthService';

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
  FormControl,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuthStore } from '../../store/authStore';
import { Spin } from 'antd';

interface ApprovalItem {
  id: string;
  title: string;
  status: string;
  submittedBy: string;
  startDate: string;
  endDate: string;
  projectName: string;
}

interface ConfirmDialogState {
  open: boolean;
  itemId: string;
  action: 'approve' | 'return' | 'reject' | null;
}

function ApprovalPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const userId = useAuthStore((state) => state.user?._id);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    itemId: '',
    action: null,
  });
  const [claims, setClaims] = useState<ApprovalItem[]>([] as ApprovalItem[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);

  const statusOptions: { value: string; label: string }[] = [
    { value: 'pending approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'returned', label: 'Returned' }
  ];

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    authService.getAllClaims()
      .then((result) => {
        const rawClaims = result.pageData;
        const mappedClaims: ApprovalItem[] = rawClaims.map((item) => ({
          id: item._id,
          title: item.claim_name,
          status: item.claim_status,
          submittedBy: item.staff_id,
          startDate: item.claim_start_date,
          endDate: item.claim_end_date,
          projectName: item.project_name,
        }));
        const userClaims = mappedClaims.filter((c) => c.submittedBy === userId);
        setClaims(userClaims);
        setTotalItems(userClaims.length);
      })
      .catch((error: unknown) => {
        console.error("Error fetching claims:", error);
      })
      .finally(() => setLoading(false));
  }, [userId]);

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
    if (!confirmDialog || !confirmDialog.action || !confirmDialog.itemId) return;

    switch (confirmDialog.action) {
      case 'approve':
        setClaims(claims.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'approved' } : item
        ));
        break;
      case 'return':
        setClaims(claims.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'returned' } : item
        ));
        break;
      case 'reject':
        setClaims(claims.map(item =>
          item.id === confirmDialog.itemId ? { ...item, status: 'rejected' } : item
        ));
        break;
    }

    handleConfirmClose();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = claims.filter((item: ApprovalItem) => {
    const matchTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = status ? item.status === status : true;
    return matchTitle && matchStatus;
  });

  // Pagination calculation
  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
    const item = claims.find(i => i.id === confirmDialog?.itemId);
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
    <Box sx={{ height: "fit-content", bgcolor: '#f5f5f5', overflowY: 'scroll', py: 1, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box className="flex gap-4" sx={{ marginBottom: '10px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            sx={{ width: { xs: "100%", sm: "250px", md: "400px" }, boxShadow: 4 }}
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
                boxShadow: 4,
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

        <Paper sx={{ width: '100%', mb: 2, boxShadow: 10 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <div className="text-center px-auto py-12">
                  <Spin size="large" />
                </div>
              ) : (
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No items found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.projectName}</TableCell>
                        <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            color={getStatusChipColor(item.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {item.status  && (
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
              )}

            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

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

export default ApprovalPage;
