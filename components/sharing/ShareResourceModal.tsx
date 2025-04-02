import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

type ShareResourceModalProps = {
  open: boolean;
  onClose: () => void;
  resourceType: 'backtest' | 'portfolio' | 'bot' | 'strategy';
  resourceId: string;
  resourceName: string;
  description?: string;
  userId: string;
};

type AccessRestrictions = {
  requirePassword: boolean;
  password: string;
  allowedEmails: string[];
  maxAccesses: number | undefined;
};

const ShareResourceModal: React.FC<ShareResourceModalProps> = ({
  open,
  onClose,
  resourceType,
  resourceId,
  resourceName,
  description,
  userId,
}) => {
  const [visibility, setVisibility] = useState<'public' | 'unlisted'>('unlisted');
  const [ttlDays, setTtlDays] = useState<number>(30);
  const [customTitle, setCustomTitle] = useState(resourceName);
  const [customDescription, setCustomDescription] = useState(description || '');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccessRestrictions, setShowAccessRestrictions] = useState(false);
  const [accessRestrictions, setAccessRestrictions] = useState<AccessRestrictions>({
    requirePassword: false,
    password: '',
    allowedEmails: [],
    maxAccesses: undefined,
  });
  const [newEmail, setNewEmail] = useState('');

  // Reset form when resource changes
  useEffect(() => {
    setCustomTitle(resourceName);
    setCustomDescription(description || '');
    setVisibility('unlisted');
    setTtlDays(30);
    setShareUrl('');
    setCopied(false);
    setError(null);
    setShowAccessRestrictions(false);
    setAccessRestrictions({
      requirePassword: false,
      password: '',
      allowedEmails: [],
      maxAccesses: undefined,
    });
  }, [resourceId, resourceName, description]);

  const handleShareResource = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build options for sharing
      const options: any = {
        title: customTitle,
        description: customDescription,
        ttlDays,
      };

      // Add access restrictions if needed
      if (visibility === 'unlisted' && showAccessRestrictions) {
        options.accessRestrictions = {
          requirePassword: accessRestrictions.requirePassword,
          password: accessRestrictions.password,
          allowedEmails: accessRestrictions.allowedEmails.length > 0 
            ? accessRestrictions.allowedEmails 
            : undefined,
          maxAccesses: accessRestrictions.maxAccesses,
        };
      }

      // Call the API endpoint
      const response = await fetch(`/api/share/${resourceType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          visibility,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share resource');
      }

      const data = await response.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      setError(err.message || 'An error occurred while sharing the resource');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes('@') && !accessRestrictions.allowedEmails.includes(newEmail)) {
      setAccessRestrictions({
        ...accessRestrictions,
        allowedEmails: [...accessRestrictions.allowedEmails, newEmail],
      });
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setAccessRestrictions({
      ...accessRestrictions,
      allowedEmails: accessRestrictions.allowedEmails.filter((e) => e !== email),
    });
  };

  const getResourceTypeName = () => {
    switch (resourceType) {
      case 'backtest':
        return 'Backtest';
      case 'portfolio':
        return 'Portfolio';
      case 'bot':
        return 'Bot';
      case 'strategy':
        return 'Strategy';
      default:
        return 'Resource';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Share {getResourceTypeName()}: {resourceName}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {shareUrl ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Your shareable link is ready!</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                fullWidth
                value={shareUrl}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleCopyToClipboard} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {copied && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Link copied to clipboard!
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Share details:</Typography>
              <Typography variant="body2">
                <strong>Visibility:</strong> {visibility === 'public' ? 'Public' : 'Unlisted'}
              </Typography>
              <Typography variant="body2">
                <strong>Expires after:</strong> {ttlDays} days
              </Typography>
              {visibility === 'unlisted' && showAccessRestrictions && (
                <>
                  {accessRestrictions.requirePassword && (
                    <Typography variant="body2">
                      <strong>Password protected:</strong> Yes
                    </Typography>
                  )}
                  {accessRestrictions.allowedEmails.length > 0 && (
                    <Typography variant="body2">
                      <strong>Limited to:</strong> {accessRestrictions.allowedEmails.length} email(s)
                    </Typography>
                  )}
                  {accessRestrictions.maxAccesses && (
                    <Typography variant="body2">
                      <strong>Maximum views:</strong> {accessRestrictions.maxAccesses}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Share settings</Typography>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ mr: 1 }} color={visibility === 'public' ? 'primary' : 'disabled'} />
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

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <AccessTimeIcon sx={{ mr: 1 }} color="action" />
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Link Expiration
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Expires after</InputLabel>
                <Select
                  value={ttlDays}
                  onChange={(e) => setTtlDays(Number(e.target.value))}
                  label="Expires after"
                >
                  <MenuItem value={1}>1 day</MenuItem>
                  <MenuItem value={7}>7 days</MenuItem>
                  <MenuItem value={30}>30 days</MenuItem>
                  <MenuItem value={90}>90 days</MenuItem>
                  <MenuItem value={365}>1 year</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {visibility === 'unlisted' && (
              <>
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAccessRestrictions}
                        onChange={(e) => setShowAccessRestrictions(e.target.checked)}
                      />
                    }
                    label="Add access restrictions"
                  />
                </Box>

                {showAccessRestrictions && (
                  <Box sx={{ mt: 2, ml: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <LockIcon sx={{ mr: 1 }} fontSize="small" />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={accessRestrictions.requirePassword}
                            onChange={(e) =>
                              setAccessRestrictions({
                                ...accessRestrictions,
                                requirePassword: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Require password"
                      />
                    </Box>

                    {accessRestrictions.requirePassword && (
                      <TextField
                        label="Password"
                        type="password"
                        value={accessRestrictions.password}
                        onChange={(e) =>
                          setAccessRestrictions({
                            ...accessRestrictions,
                            password: e.target.value,
                          })
                        }
                        margin="normal"
                        variant="outlined"
                        size="small"
                        sx={{ ml: 4 }}
                      />
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <EmailIcon sx={{ mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Limit access to specific emails</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: 4 }}>
                      <TextField
                        label="Email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddEmail}
                        disabled={!newEmail.includes('@')}
                      >
                        Add
                      </Button>
                    </Box>

                    {accessRestrictions.allowedEmails.length > 0 && (
                      <Box sx={{ mt: 1, ml: 4 }}>
                        {accessRestrictions.allowedEmails.map((email) => (
                          <Chip
                            key={email}
                            label={email}
                            onDelete={() => handleRemoveEmail(email)}
                            sx={{ m: 0.5 }}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <VisibilityOffIcon sx={{ mr: 1 }} fontSize="small" />
                      <Typography variant="body2">Limit maximum number of views</Typography>
                    </Box>

                    <TextField
                      label="Max views"
                      type="number"
                      value={accessRestrictions.maxAccesses || ''}
                      onChange={(e) =>
                        setAccessRestrictions({
                          ...accessRestrictions,
                          maxAccesses: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      margin="normal"
                      variant="outlined"
                      size="small"
                      sx={{ ml: 4 }}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {shareUrl ? (
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        ) : (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleShareResource}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Generating Link...' : 'Generate Share Link'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareResourceModal;
