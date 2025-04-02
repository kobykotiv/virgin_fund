import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import LinkIcon from '@mui/icons-material/Link';
import LockIcon from '@mui/icons-material/Lock';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type ResourceType = 'backtest' | 'portfolio' | 'bot' | 'strategy' | 'all';

const SharedResourcesManagementPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState<ResourceType>('all');
  const [sharedResources, setSharedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [ttlDays, setTtlDays] = useState(30);
  const [visibility, setVisibility] = useState<'public' | 'unlisted'>('unlisted');
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchSharedResources();
  }, [selectedTab]);

  const fetchSharedResources = async () => {
    setLoading(true);
    try {
      let url = `/api/user/${userId}/shared-resources`;
      
      if (selectedTab !== 'all') {
        url += `?resourceType=${selectedTab}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      setSharedResources(data.resources);
    } catch (error) {
      console.error('Error fetching shared resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: ResourceType) => {
    setSelectedTab(newValue);
  };

  const handleEditClick = (resource: any) => {
    setSelectedResource(resource);
    setTitle(resource.title);
    setVisibility(resource.visibility);
    
    // Calculate remaining days
    const expiresAt = new Date(resource.expiresAt);
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTtlDays(diffDays > 0 ? diffDays : 30); // Default to 30 if expired
    
    setEditModalOpen(true);
  };

  const handleDeleteClick = (resource: any) => {
    setSelectedResource(resource);
    setDeleteModalOpen(true);
  };

  const handleUpdateResource = async () => {
    setUpdateLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/share/manage/${selectedResource.shareId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          visibility,
          ttlDays,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shared resource');
      }

      // Close modal and refresh list
      setEditModalOpen(false);
      fetchSharedResources();
    } catch (err) {
      setError(err.message || 'An error occurred while updating the resource');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteResource = async () => {
    try {
      const response = await fetch(`/api/share/manage/${selectedResource.shareId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete shared resource');
      }

      // Close modal and refresh list
      setDeleteModalOpen(false);
      fetchSharedResources();
    } catch (error) {
      console.error('Error deleting shared resource:', error);
    }
  };

  const handleCopyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'backtest':
        return 'primary';
      case 'portfolio':
        return 'success';
      case 'bot':
        return 'warning';
      case 'strategy':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getExpirationStatus = (expiresAt: string) => {
    const expiration = new Date(expiresAt);
    const now = new Date();
    
    if (expiration < now) {
      return <Chip size="small" color="error" label="Expired" />;
    }
    
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return <Chip size="small" color="warning" label={`Expires in ${diffDays} days`} />;
    }
    
    return <Chip size="small" color="success" label={`Expires ${formatDate(expiresAt)}`} />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Shared Resources
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Shared" value="all" />
          <Tab label="Backtests" value="backtest" />
          <Tab label="Portfolios" value="portfolio" />
          <Tab label="Bots" value="bot" />
          <Tab label="Strategies" value="strategy" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sharedResources.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No shared resources found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {selectedTab === 'all' 
                  ? "You haven't shared any resources yet." 
                  : `You haven't shared any ${selectedTab}s yet.`}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddCircleOutlineIcon />}
                href={selectedTab === 'all' ? '/dashboard' : `/${selectedTab}s`}
              >
                {selectedTab === 'all' 
                  ? "Go to Dashboard" 
                  : `Go to ${selectedTab}s`}
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Visibility</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sharedResources.map((resource: any) => (
                    <TableRow key={resource._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {resource.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={resource.resourceType} 
                          size="small" 
                          color={getResourceTypeColor(resource.resourceType)}
                        />
                      </TableCell>
                      <TableCell>
                        {resource.visibility === 'public' ? (
                          <Chip icon={<PublicIcon />} label="Public" size="small" />
                        ) : (
                          <Chip icon={<LinkIcon />} label="Unlisted" size="small" />
                        )}
                        {resource.accessRestrictions?.requirePassword && (
                          <Chip icon={<LockIcon />} label="Protected" size="small" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Total views">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {resource.accessCount}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{formatDate(resource.createdAt)}</TableCell>
                      <TableCell>{getExpirationStatus(resource.expiresAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Copy link">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyToClipboard(resource.shareUrl)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit sharing settings">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditClick(resource)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete share">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteClick(resource)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      
      {/* Edit Share Modal */}
      {selectedResource && (
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Edit Share Settings
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
            
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Visibility
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.checked ? 'public' : 'unlisted')}
                  />
                }
                label={visibility === 'public' ? 'Public' : 'Unlisted'}
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
              {visibility === 'public'
                ? 'Public links are visible to everyone and can be discovered in search.'
                : 'Unlisted links are only accessible to people with the link.'}
            </Typography>
            
            <TextField
              fullWidth
              label="Extend expiration (days)"
              type="number"
              value={ttlDays}
              onChange={(e) => setTtlDays(Number(e.target.value))}
              margin="normal"
              InputProps={{
                inputProps: { min: 1, max: 365 },
              }}
              helperText={`Link will expire on ${new Date(
                new Date().getTime() + ttlDays * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}`}
            />
            
            <TextField
              fullWidth
              label="Share URL"
              value={selectedResource.shareUrl}
              margin="normal"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end"
                      onClick={() => handleCopyToClipboard(selectedResource.shareUrl)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {copied && (
              <Typography variant="body2" color="primary">
                Link copied to clipboard!
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateResource} 
              variant="contained" 
              color="primary"
              disabled={updateLoading}
              startIcon={updateLoading && <CircularProgress size={20} />}
            >
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Delete Confirmation Modal */}
      {selectedResource && (
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>
            Delete Share
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the share link for "{selectedResource.title}"?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              This action cannot be undone. Anyone with the link will no longer be able to access the resource.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteResource} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default SharedResourcesManagementPage;
