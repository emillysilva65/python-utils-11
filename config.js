const config = {
    apiUrl: 'https://api.crypto.com',
    timeout: 5000,
    maxRetries: 3,
};

const handleError = (error) => {
    console.error('An error occurred:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused. Check your API URL.');
    } else if (error.code === 'ETIMEDOUT') {
        console.error('Request timed out. Increasing timeout...');
        config.timeout += 2000; // add extra timeout
    } else {
        console.error('Unexpected error type. Retrying...');
    }
};

const fetchWithRetries = async (url, options, retries = config.maxRetries) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        handleError(error);
        if (retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            return fetchWithRetries(url, options, retries - 1);
        } else {
            throw new Error('Max retries reached');
        }
    }
};

export { config, fetchWithRetries };