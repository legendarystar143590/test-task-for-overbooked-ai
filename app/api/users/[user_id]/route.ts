
export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const { user_id } = await params;
  console.log("Here ->", user_id)
  // Check if user_id is valid
  if (!user_id || typeof user_id !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
  }

  const response = await fetch(`http://localhost:8000/users/${user_id}/recommendations`);

  if (!response.ok) throw new Error('Failed to retrieve recommendations');

  const data = await response.json();
  console.log(data)
  let recommendations;
  if (data.length > 0) {
    recommendations= data[0].preferences; 
    console.log(recommendations)
  } 

  if (recommendations) {
    return new Response(JSON.stringify({ user_id, recommendations }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: `No recommendations found for user_id ${user_id}.` }), { status: 404 });
  }
}