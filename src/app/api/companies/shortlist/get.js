export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  const jobId = searchParams.get('jobId');
  const baseUrl = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net';
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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Shortlist GET parse error:', e, 'Raw response:', text);
      return new Response(
        JSON.stringify({ message: 'Server returned non-JSON response (possible error page)' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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