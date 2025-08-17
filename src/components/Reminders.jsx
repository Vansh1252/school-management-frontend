import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
// import './Reminders.css';

// Reminders component displays a list of reminders and a button to add new ones
const Reminders = ({ reminders = [], onAddReminder }) => {
    return (
        <div className="Reminders">
            {/* Header with title and add button */}
            <div className="Reminders-header">
                <h3>Reminders</h3>
                <IconButton onClick={onAddReminder}>
                    <MoreVertIcon />
                </IconButton>
            </div>
            {/* Render each reminder */}
            {reminders.map((reminder, index) => (
                <div key={reminder._id || index} className="Reminder">
                    <div className="header-4">
                        {/* Display reminder date with color */}
                        <h4 className={reminder.color || 'yellow'}>
                            {new Date(reminder.date_date).toLocaleDateString()}
                        </h4>
                    </div>
                    <hr />
                    {/* Reminder message */}
                    <p>{reminder.str_message}</p>
                </div>
            ))}
            {/* Show message if no reminders */}
            {reminders.length === 0 && (
                <div className="Reminder">
                    <p>No reminders available</p>
                </div>
            )}
        </div>
    );
};

export default Reminders;