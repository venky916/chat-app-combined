import _ from 'lodash';
import { format } from 'date-fns';

export const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
        // Single name, use the first letter
        return _.toUpper(words[0].charAt(0));
    }
    // Multiple words, take the first letter of the first two words
    return _.toUpper(words[0].charAt(0) + words[1].charAt(0));
};

export const formatDateWithOrdinal = (date) => {
    const day = format(date, 'd'); // Extract the day as a number
    const month = format(date, 'MMM'); // Short month name (e.g., Aug)
    const time = format(date, 'hh:mm a'); // Time in 12-hour format with AM/PM

    // Add ordinal suffix
    const getOrdinalSuffix = (day) => {
        const lastDigit = day % 10;
        const lastTwoDigits = day % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th';
        if (lastDigit === 1) return 'st';
        if (lastDigit === 2) return 'nd';
        if (lastDigit === 3) return 'rd';
        return 'th';
    };

    const ordinalSuffix = getOrdinalSuffix(parseInt(day, 10));
    return `${day}${ordinalSuffix} ${month} ${time}`;
};


export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getSenderId = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
};


export const isSameSender = (messages, msg, idx, userId) => {
    return (
        idx < messages.length - 1 &&
        (
            messages[idx + 1].sender._id !== msg.sender._id ||
            messages[idx + 1].sender._id === undefined
        ) &&
        messages[idx].sender._id !== userId
    )
}

export const isLastMessage = (messages, idx, userId) => {
    return (
        idx === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}

export const isSameUser = (messages, msg, idx) => {
    return idx > 0 && messages[idx - 1].sender._id === msg.sender._id;
}

export const isSameSenderMargin = (messages, msg, idx, userId) => {
    if (
        idx < messages.length - 1 &&
        messages[idx + 1].sender._id === msg.sender._id &&
        messages[idx].sender._id !== userId
    )
        return 33;
    else if (
        (idx < messages.length - 1 &&
            messages[idx + 1].sender._id !== msg.sender._id &&
            messages[idx].sender._id !== userId) ||
        (idx === messages.length - 1 && messages[idx].sender._id !== userId)
    ) {
        return 0
    }
    else return 'auto'
}