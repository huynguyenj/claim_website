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
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import type { ClaimRequest } from "../../model/Claim";

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<ClaimRequest[]>([
    {
      id: "1",
      title: "Overtime Salary - John Doe",
      description: "Overtime work on project XYZ",
      amount: 2000000,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Overtime Salary - Jane Smith",
      description: "Weekend work for client meeting preparation",
      amount: 1500000,
      status: "PENDING_APPROVAL",
      createdAt: new Date().toISOString(),
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
                  amount: Number(formData.amount),
                }
              : request
          )
        );
      } else {
        const newRequest: ClaimRequest = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          amount: Number(formData.amount),
          status: "DRAFT",
          createdAt: new Date().toISOString(),
        };
        setRequests([...requests, newRequest]);
      }
      setIsModalOpen(false);
      setFormData({ title: "", description: "", amount: "" });
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

  const filteredRequests = requests.filter((request) =>
    request.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <Box className="mb-4 flex justify-between items-center">
          <Box className="flex gap-4">
            <TextField
              placeholder="Search requests"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <FormControl size="small" className="w-48">
              <InputLabel>Status</InputLabel>
              <Select label="Status">
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
          >
            New Request
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount (VND)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>
                    {request.amount.toLocaleString("vi-VN")}
                  </TableCell>
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
                    {new Date(request.createdAt).toLocaleDateString()}
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
                            amount: request.amount.toString(),
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(request.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleRequestApproval(request.id)}
                        disabled={request.status === "PENDING_APPROVAL"}
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

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>
            {editingId ? "Edit Request" : "New Request"}
          </DialogTitle>
          <DialogContent>
            <Box className="flex flex-col gap-4 pt-4">
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                fullWidth
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
              />
              <TextField
                label="Amount (VND)"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                fullWidth
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
      </div>
    </div>
  );
};

export default RequestPage;
