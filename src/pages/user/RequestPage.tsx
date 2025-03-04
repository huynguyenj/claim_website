import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { ClaimRequest, NewClaimRequest } from '../../model/Claim';
import authService from '../../services/AuthService';

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
  });
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | ''>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');


  const projects = [
    { id: 'project_a_001', name: 'Project A' },
    { id: 'project_b_002', name: 'Project B' },
    { id: 'project_c_003', name: 'Project C' }, 

  ];

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
    { value: 'PAID', label: 'Paid' },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await authService.getRequests();
        setRequests(response);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    try {
      const newRequest: NewClaimRequest = {
        project_id: selectedProjectId,
        approval_id: '67b2fd17f6afc068678f14b5',
        claim_name: formData.title,
        claim_start_date: new Date(startDate).toISOString(),
        claim_end_date: new Date(endDate).toISOString(),
        total_work_time: parseInt(workTime),
        remark: formData.description,
        user_id: '',
        claim_status: '',
        _id: ''
      };

      const response = await authService.createClaim(newRequest);
      if (response) {
        const completeRequest: ClaimRequest = {
          ...response,
          claim_status: 'DRAFT',
          is_deleted: false,
          _id: response._id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          __v: 0
        };

        console.log('New Request Data:', completeRequest);
        setRequests([...requests, completeRequest]);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', amount: '' });
        setStartDate('');
        setEndDate('');
        setWorkTime('');
      }
    } catch (error) {
      console.error('Operation failed', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await authService.deleteClaim(id);
        setRequests(requests.filter(request => request._id !== id));
      } catch (error) {
        console.error('Failed to delete request', error);
      }
    }
  };

  const handleRequestApproval = async (id: string) => {
    try {
      const updatedRequest = requests.find(request => request._id === id);
      if (updatedRequest) {
        updatedRequest.claim_status = 'PENDING_APPROVAL';
        await authService.updateClaim(updatedRequest);
        setRequests(requests.map(request => request._id === id ? updatedRequest : request));
      }
    } catch (error) {
      console.error('Failed to update request status', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearchText = request.claim_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus ? request.claim_status === selectedStatus : true;
    return matchesSearchText && matchesStatus;
  });

  return (
    <div className="flex">
      <Grid container spacing={2} className="p-6">
        <Grid item xs={12}>
          <Box className="mb-4 flex flex-col md:flex-row justify-between items-center">
            <Box className="flex gap-4">
              <TextField
                placeholder="Search by claim name..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: { xs: '100%', sm: '250px', md: '300px' },
                  height: '40px',
                  '& .MuiInputBase-input': {
                    height: '40px',
                    padding: '0 10px',
                  },
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: '150px' }, height: '40px' }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    height: '40px',
                    '& .MuiSelect-select': {
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
              sx={{ marginTop: { xs: '10px', md: '0' } }}
            >
              New Request
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Duration of Work Overtime</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id}>

                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${{
                        DRAFT: 'bg-gray-200',
                        PENDING_APPROVAL: 'bg-yellow-200',
                        APPROVED: 'bg-green-200',
                        REJECTED: 'bg-red-200',
                        PENDING_PAYMENT: 'bg-blue-200',
                        PAID: 'bg-purple-200',
                      }[request.claim_status]}`}>
                        {request.claim_status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(request.claim_start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.claim_end_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box className="flex gap-2">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingId(request._id);
                            setFormData({
                              title: request.claim_name,
                              description: request.remark,
                              amount: '',
                            });
                            setIsModalOpen(true);
                          }}
                          startIcon={<EditIcon />}
                          sx={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(request._id)}
                          startIcon={<DeleteIcon />}
                          sx={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleRequestApproval(request._id)}
                          disabled={request.claim_status === 'PENDING_APPROVAL'}
                          sx={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        >
                          Request Approval
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingId ? "Edit Request" : "New Request"}
            </DialogTitle>
            <DialogContent>
              <Box className="flex flex-col gap-4 pt-4">
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={selectedProjectId}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      setSelectedProjectId(projectId);
                      const project = projects.find(p => p.id === projectId);
                      setSelectedProjectName(project ? project.name : '');
                    }}
                    label="Project"
                  >
                    {projects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Project Name"
                  value={selectedProjectName}
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <TextField
                    label="Duration of Work Overtime"
                    value={workTime}
                    onChange={(e) => setWorkTime(e.target.value)}
                    required
                    type="number"
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default RequestPage;