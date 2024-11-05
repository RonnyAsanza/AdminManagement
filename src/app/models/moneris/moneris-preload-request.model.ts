
export interface MonerisPreloadRequest {
    txn_total: string
    token: Token[]
    ask_cvv: string
    order_no: string
    cust_id: string
    dynamic_descriptor: string
    language: string
    recur: Recur
    cart: Cart
    contact_details: ContactDetails
    shipping_details: ShippingDetails
    billing_details: BillingDetails
    permitKey: number
  }
  
  export interface Token {
    data_key: string
    issuer_id: string
  }
  
  export interface Recur {
    bill_now: string
    recur_amount: string
    start_date: string
    recur_unit: string
    recur_period: string
    number_of_recurs: string
  }
  
  export interface Cart {
    items: Item[]
    subtotal: string
    tax: Tax
  }
  
  export interface Item {
    url: string
    description: string
    product_code: string
    unit_cost: string
    quantity: string
  }
  
  export interface Tax {
    amount: string
    description: string
    rate: string
  }
  
  export interface ContactDetails {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  
  export interface ShippingDetails {
    address_1: string
    address_2: string
    city: string
    province: string
    country: string
    postal_code: string
  }
  
  export interface BillingDetails {
    address_1: string
    address_2: string
    city: string
    province: string
    country: string
    postal_code: string
  }
  