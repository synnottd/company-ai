import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.get('https://example.com/api/validate-industry', () => {
    return HttpResponse.json({
      industryMatch: Math.random() > 0.5 ? true : false,
      companyOverview: "This is a sample company overview.",
    })
  }),
]