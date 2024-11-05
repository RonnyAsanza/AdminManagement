export interface MonerisPreloadResponse {
    response: Response
  }
  
  export interface Response {
    success: string
    ticket: string
    error: Error
  }
  
  export interface Error {
    billing_details: BillingDetails
  }
  
  export interface BillingDetails {
    data: string
  }
