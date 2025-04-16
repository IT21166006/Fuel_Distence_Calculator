import { useState, useEffect } from 'react';

// This is a mock service that simulates tracking online users
// In a real application, you would use a backend service with WebSockets
const UserCountService = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching online user count
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to your backend
        // For now, we'll simulate a random number of users between 50-200
        const randomDelay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const mockUserCount = Math.floor(Math.random() * 150) + 50; // 50-200 users
        setOnlineUsers(mockUserCount);
        setError(null);
      } catch (err) {
        console.error('Error fetching user count:', err);
        setError('Failed to fetch online user count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
    
    // Set up interval to update user count periodically
    const intervalId = setInterval(fetchUserCount, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return { onlineUsers, isLoading, error };
};

export default UserCountService; 