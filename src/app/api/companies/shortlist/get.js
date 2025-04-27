export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  const jobId = searchParams.get('jobId');
  const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized: No access token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/company/company/${companyId}/job/${jobId}/shortlisted`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || 'Failed to fetch shortlisted candidates' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Shortlist GET error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}