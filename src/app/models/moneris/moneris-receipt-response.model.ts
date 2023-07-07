export interface MonerisReceiptResponse {
    response: Response
  }
  
  export interface Response {
    success: string
    request: Request
    receipt: Receipt
  }
  
  export interface Request {
    txn_total: string
    cust_info: CustInfo
    shipping: Shipping
    billing: Billing
    recur: Recur
    cart: Cart
    cc_total: string
    cc: Cc
    mcp: Mcp
    gift: Gift[]
    wallet: Wallet
    ticket: string
    cust_id: string
    dynamic_descriptor: string
    order_no: string
    eci: string
  }
  
  export interface CustInfo {
    first_name: string
    last_name: string
    phone: string
    email: string
  }
  
  export interface Shipping {
    address_1: string
    address_2: string
    city: string
    country: string
    province: string
    postal_code: string
  }
  
  export interface Billing {
    address_1: string
    address_2: string
    city: string
    province: string
    country: string
    postal_code: string
  }
  
  export interface Recur {
    number_of_recurs: string
    recur_period: string
    recur_amount: string
    recur_unit: string
    start_date: string
    bill_now: string
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
  
  export interface Cc {
    first6last4: string
    expiry: string
    cardholder: string
  }
  
  export interface Mcp {
    merchant_settlement_amount: string
    cardholder_currency_code: string
  }
  
  export interface Gift {
    balance_remaining: string
    Description: string
    first4last4: string
    pan: string
    cvd: string
    balance_used: string
  }
  
  export interface Wallet {
    type: string
    paymentData: PaymentData
  }
  
  export interface PaymentData {
    token: Token
  }
  
  export interface Token {
    paymentData: PaymentData2
    paymentMethod: PaymentMethod
    transactionIdentifier: string
  }
  
  export interface PaymentData2 {
    data: string
    signature: string
    header: Header
    version: string
  }
  
  export interface Header {
    publicKeyHash: string
    ephemeralPublicKey: string
    transactionId: string
  }
  
  export interface PaymentMethod {
    displayName: string
    network: string
    type: string
  }
  
  export interface Receipt {
    result: string
    gift: Gift2[]
    cc: Cc2
  }
  
  export interface Gift2 {
    order_no: string
    transaction_no: string
    reference_no: string
    response_code: string
    benefit_amount: string
    benefit_remaining: string
    first6last4: string
  }
  
  export interface Cc2 {
    order_no: string
    cust_id: string
    transaction_no: string
    reference_no: string
    transaction_code: string
    transaction_type: string
    transaction_date_time: string
    corporate_card: any
    amount: string
    response_code: string
    iso_response_code: string
    approval_code: string
    card_type: string
    dynamic_descriptor: string
    invoice_number: any
    customer_code: any
    eci: string
    cvd_result_code: string
    avs_result_code: string
    cavv_result_code: any
    first6last4: string
    expiry_date: string
    recur_success: string
    issuer_id: any
    is_debit: any
    ecr_no: string
    batch_no: string
    sequence_no: string
    result: string
    cf_success: string
    cf_fee_amt: string
    cf_fee_rate: string
    cf_fee_type: string
    cf_status: string
    tokenize: Tokenize
    mcp: Mcp2
    fraud: Fraud
    vault_data: VaultDaum[]
  }
  
  export interface Tokenize {
    success: string
    first4last4: string
    datakey: string
    status: string
    message: string
  }
  
  export interface Mcp2 {
    merchant_settlement_amount: string
    cardholder_currency_code: string
    mcp_rate: string
    decimal_precision: string
    cardholder_amount: string
    cardholder_currency_desc: string
  }
  
  export interface Fraud {
    "3d_secure": N3dSecure
    kount: Kount
    avs: Avs
    cvd: Cvd
  }
  
  export interface N3dSecure {
    decision_origin: string
    result: string
    condition: string
    status: string
    code: string
    details: string
  }
  
  export interface Kount {
    decision_origin: string
    result: string
    condition: any
    status: string
    code: string
    details: string
  }
  
  export interface Avs {
    decision_origin: string
    result: string
    condition: string
    status: string
    code: string
    details: string
  }
  
  export interface Cvd {
    decision_origin: string
    result: string
    condition: string
    status: string
    code: string
    details: string
  }
  
  export interface VaultDaum {
    data_key: string
    is_valid: string
  }
  