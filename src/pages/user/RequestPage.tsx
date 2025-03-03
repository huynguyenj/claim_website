import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { ClaimRequest } from "../../model/ClaimData";

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<ClaimRequest[]>([
    {
      id: "1",
      title: "Overtime Salary - John Doe",
      description: "Overtime work on project XYZ",
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      projectName: "Project XYZ",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      workTime: "8 hours",
    },
    {
      id: "2",
      title: "Overtime Salary - Jane Smith",
      description: "Weekend work for client meeting preparation",
      status: "PENDING_APPROVAL",
      createdAt: new Date().toISOString(),
      projectName: "Client Meeting",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      workTime: "6 hours",
    },
    {
      id: "3",
      title: "Overtime Salary - Alice Johnson",
      description: "Extra hours for project ABC",
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      projectName: "Project ABC",
      startDate: "2023-10-01",
      endDate: "2023-10-05",
      workTime: "10 hours",
    },
    {
      id: "4",
      title: "Overtime Salary - Bob Brown",
      description: "Additional work for report preparation",
      status: "REJECTED",
      createdAt: new Date().toISOString(),
      projectName: "Report Preparation",
      startDate: "2023-10-06",
      endDate: "2023-10-07",
      workTime: "5 hours",
    },
    {
      id: "5",
      title: "Overtime Salary - Charlie Green",
      description: "Work on client feedback",
      status: "PENDING_PAYMENT",
      createdAt: new Date().toISOString(),
      projectName: "Client Feedback",
      startDate: "2023-10-08",
      endDate: "2023-10-09",
      workTime: "7 hours",
    },
  ]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
  });
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | "">("");

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING_APPROVAL", label: "Pending Approval" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING_PAYMENT", label: "Pending Payment" },
    { value: "PAID", label: "Paid" },
  ];

  const handleSubmit = () => {
    try {
      if (editingId) {
        setRequests(
          requests.map((request) =>
            request.id === editingId
              ? {
                  ...request,
                  title: formData.title,
                  description: formData.description,
                  status: "DRAFT",
                  createdAt: new Date().toISOString(),
                  projectName,
                  startDate,
                  endDate,
                  workTime: `${workTime} hours`, // Thêm "hours" vào workTime
                }
              : request
          )
        );
      } else {
        const newRequest: ClaimRequest = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          projectName,
          startDate,
          endDate,
          workTime: `${workTime} hours`, // Thêm "hours" vào workTime
        };
        setRequests([...requests, newRequest]);
      }
      setIsModalOpen(false);
      setFormData({ title: "", description: "", amount: "" });
      setProjectName("");
      setStartDate("");
      setEndDate("");
      setWorkTime("");
    } catch (error) {
      console.error("Operation failed", error);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      setRequests(requests.filter((request) => request.id !== id));
    }
  };

  const handleRequestApproval = (id: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "PENDING_APPROVAL" } : request
      )
    );
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearchText = request.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus
      ? request.status === selectedStatus
      : true;
    return matchesSearchText && matchesStatus;
  });

  return (
    <div className="flex">
      <Grid container spacing={2} className="p-6">
        <Grid item xs={12}>
          <Box className="mb-4 flex flex-col md:flex-row justify-between items-center">
            <Box className="flex gap-4">
              <TextField
                placeholder="Search by claim ID..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: { xs: "100%", sm: "250px", md: "300px" },
                  height: "40px",
                  "& .MuiInputBase-input": {
                    height: "40px",
                    padding: "0 10px",
                  },
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FormControl
                size="small"
                sx={{ minWidth: { xs: "100%", sm: "150px" }, height: "40px" }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    height: "40px",
                    "& .MuiSelect-select": {
                      height: "40px",
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
              sx={{ marginTop: { xs: "10px", md: "0" } }}
            >
              New Request
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "auto",
              maxHeight: "400px",
            }}
          >
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
                  <TableRow key={request.id}>
                    <TableCell>{request.projectName}</TableCell>
                    <TableCell>{request.workTime}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          {
                            DRAFT: "bg-gray-200",
                            PENDING_APPROVAL: "bg-yellow-200",
                            APPROVED: "bg-green-200",
                            REJECTED: "bg-red-200",
                            PENDING_PAYMENT: "bg-blue-200",
                            PAID: "bg-purple-200",
                          }[request.status]
                        }`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(request.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-2">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingId(request.id);
                            setFormData({
                              title: request.title,
                              description: request.description,
                              amount: "",
                            });
                            setIsModalOpen(true);
                          }}
                          startIcon={<EditIcon />}
                          sx={{ padding: "4px 8px", fontSize: "0.875rem" }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(request.id)}
                          startIcon={<DeleteIcon />}
                          sx={{ padding: "4px 8px", fontSize: "0.875rem" }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleRequestApproval(request.id)}
                          disabled={request.status === "PENDING_APPROVAL"}
                          sx={{ padding: "4px 8px", fontSize: "0.875rem" }}
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

          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editingId ? "Edit Request" : "New Request"}
            </DialogTitle>
            <DialogContent>
              <Box className="flex flex-col gap-4 pt-4">
                <TextField
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
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
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
