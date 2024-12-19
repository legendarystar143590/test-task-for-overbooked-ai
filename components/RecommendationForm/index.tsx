"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function RecommendationForm() {
  const [userId, setUserId] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle generating recommendations
  const handleGenerateRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, preferences }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Generated Recommendations:', data);
      setRecommendations(data.recommendations);
      alert("Successfully Saved!")
      setErrorMessage('');
    } else {
      console.error(data.error);
      setErrorMessage(data.error);
    }
  };

  // Function to handle retrieving saved recommendations
  const handleRetrieveRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if(userId===""){
      return;
    }
    const userResponse = await fetch(`api/users/${userId}`);

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('User Recommendations:', userData);
      setRecommendations(userData.recommendations);
      setErrorMessage('');
    } else {
      const errorData = await userResponse.json();
      console.log(errorData.error);
      setErrorMessage(errorData.error);
    }
  };

  return (
    <main className="container flex flex-col items-center mx-auto p-1">
      <h1 className="text-3xl font-bold mb-8 text-center">Recommendation System</h1>
      
      <Card className="p-6 mb-8 md:w-[500px] shadow-lg rounded-lg">
        <form onSubmit={handleGenerateRecommendations} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Preferences</label>
            <Input
              value={preferences.join(', ')} // Join for display purposes
              onChange={(e) => setPreferences(e.target.value.split(',').map(pref => pref.trim()))}
              placeholder="Enter preferences (comma-separated)"
              required
              className="w-full"
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button type="submit" className="w-full sm:w-auto">Generate</Button>
            <Button type='button' onClick={handleRetrieveRecommendations} className="w-full sm:w-auto">Get</Button>
          </div>
        </form>
      </Card>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {recommendations && recommendations.length > 0 && (
        <Card className="p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Recommendations</h2>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="p-2 bg-gray-50 rounded">{rec}</li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  )
}