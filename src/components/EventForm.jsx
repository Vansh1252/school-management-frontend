import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// EventForm component handles both Event and Reminder creation dialogs
const EventForm = ({ open, onClose, onSubmit, type }) => {
    // Set initial form state based on type (event or reminder)
    const initialState = type === 'event' ? {
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    } : {
        title: '',
        message: '',
        date: new Date().toISOString().split('T')[0],
        color: 'green'
    };

    const [formData, setFormData] = useState(initialState);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Pass form data to parent
        setFormData(initialState); // Reset form
        onClose(); // Close dialog
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{type === 'event' ? 'Add New Event' : 'Add New Reminder'}</DialogTitle>
            <DialogContent>
                {/* Title input */}
                <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    margin="normal"
                />
                {/* Event or Reminder specific fields */}
                {type === 'event' ? (
                    // Description for event
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                ) : (
                    <>
                        {/* Message for reminder */}
                        <TextField
                            fullWidth
                            label="Message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        {/* Color selection for reminder */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                label="Color"
                            >
                                <MenuItem value="green">Green</MenuItem>
                                <MenuItem value="blue">Blue</MenuItem>
                                <MenuItem value="red">Red</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                {/* Date input */}
                <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                {/* Cancel and Submit buttons */}
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add {type === 'event' ? 'Event' : 'Reminder'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventForm;