import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CardMedia,
  Skeleton,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import LaunchIcon from '@mui/icons-material/Launch';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useRouter } from 'next/router';

type ResourceType = 'backtest' | 'portfolio' | 'bot' | 'strategy' | 'all';

const PublicResourcesPage: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<ResourceType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('accessCount');
  const [sortOrder, setSortOrder] = useState(-1); // -1 for descending, 1 for ascending

  const itemsPerPage = 12;

  useEffect(() => {
    fetchResources();
  }, [selectedTab, page, sortBy, sortOrder]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `/api/public-resources?page=${page}&limit=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      if (selectedTab !== 'all') {
        url += `&resourceType=${selectedTab}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      setResources(data.resources);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('Error fetching public resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchResources();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: ResourceType) => {
    setSelectedTab(newValue);
    setPage(1); // Reset to first page on tab change
  };

  const handleOpenResource = (shareId: string, resourceType: string) => {
    router.push(`/public/${resourceType}s/${shareId}`);
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

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'backtest':
        return '📊';
      case 'portfolio':
        return '💼';
      case 'bot':
        return '🤖';
      case 'strategy':
        return '📈';
      default:
        return '📄';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Explore Public Resources
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Resources" value="all" />
          <Tab label="Backtests" value="backtest" />
          <Tab label="Portfolios" value="portfolio" />
          <Tab label="Bots" value="bot" />
          <Tab label="Strategies" value="strategy" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" variant="contained" size="small">
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>
        
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
            size="small"
          >
            <MenuItem value="accessCount">Popularity</MenuItem>
            <MenuItem value="createdAt">Date Created</MenuItem>
          </Select>
        </FormControl>
        
        <IconButton onClick={() => setSortOrder(sortOrder * -1)}>
          <SortIcon sx={{ transform: sortOrder === 1 ? 'none' : 'rotate(180deg)' }} />
        </IconButton>
      </Box>
      
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={80} height={30} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {resources.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6">No resources found</Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search or explore different categories
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {resources.map((resource: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={resource._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {resource.thumbnail ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={resource.thumbnail}
                        alt={resource.title}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 140, 
                          bgcolor: 'action.hover', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '3rem'
                        }}
                      >
                        {getResourceTypeIcon(resource.resourceType)}
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h2" noWrap title={resource.title}>
                          {resource.title}
                        </Typography>
                        <Chip 
                          label={resource.resourceType} 
                          size="small" 
                          color={getResourceTypeColor(resource.resourceType)}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                        {resource.description?.substring(0, 100)}
                        {resource.description?.length > 100 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" color="textSecondary">
                          {resource.accessCount} views • Created {new Date(resource.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        endIcon={<LaunchIcon />}
                        onClick={() => handleOpenResource(resource.shareId, resource.resourceType)}
                      >
                        View
                      </Button>
                      <IconButton size="small">
                        <StarBorderIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default PublicResourcesPage;
