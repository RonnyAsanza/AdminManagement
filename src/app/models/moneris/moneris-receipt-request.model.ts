export interface MonerisReceiptRequest {
  store_id: string
  api_token: string
  checkout_id: string
  ticket: string
  environment: string
  action: string,
  permitKey: number
}
