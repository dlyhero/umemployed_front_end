export async function GET(request, { params }) {
    const companyId = params.companyId;
    const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
    const applicationsUrl = `${baseUrl}/api/company/company/${companyId}/applications/`;
  
    try {
      const response = await fetch(applicationsUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const applications = await response.json();
      return new Response(JSON.stringify(applications), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching company applications:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch applications' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }