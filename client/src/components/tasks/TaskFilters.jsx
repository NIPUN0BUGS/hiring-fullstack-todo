import { Badge, Box, Tab, Tabs, Typography } from '@mui/material';
import { ArrowDownWideNarrow } from 'lucide-react';

const filters = [
  { id: 'all', label: 'All tasks', getCount: (stats) => stats.total },
  { id: 'active', label: 'In progress', getCount: (stats) => stats.remaining },
  { id: 'completed', label: 'Completed', getCount: (stats) => stats.completed },
];

export default function TaskFilters({ value, onChange, stats }) {
  return (
    <Box className="list-toolbar">
      <Tabs
        value={value}
        onChange={(_event, nextValue) => onChange(nextValue)}
        aria-label="Filter tasks"
        className="filter-tabs"
        variant="scrollable"
        scrollButtons={false}
      >
        {filters.map((filter) => (
          <Tab
            key={filter.id}
            value={filter.id}
            label={(
              <Badge badgeContent={filter.getCount(stats)} color="default" className="filter-badge" showZero>
                <Box component="span" sx={{ pr: 1.5 }}>{filter.label}</Box>
              </Badge>
            )}
          />
        ))}
      </Tabs>
      <Typography component="span" className="sort-label">
        <ArrowDownWideNarrow size={14} /> Newest first
      </Typography>
    </Box>
  );
}
