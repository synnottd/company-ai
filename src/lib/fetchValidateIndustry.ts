export function validateIndustry(company: string): Promise<{ industryMatch: boolean; companyOverview: string }> {
  return fetch(`https://example.com/api/validate-industry?${new URLSearchParams({company}).toString()}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    return {
      industryMatch: data.industryMatch,
      companyOverview: data.companyOverview,
    };
  });
}
