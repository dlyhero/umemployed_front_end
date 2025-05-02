import axios from 'axios';

export async function POST(req) {
  const { companyId, jobId, candidate_id } = await req.json();
  const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized: No access token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.post(
      `${baseUrl}/api/company/company/${companyId}/job/${jobId}/shortlist`,
      { candidate_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Shortlist POST error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to shortlist candidate';
    return new Response(JSON.stringify({ message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}