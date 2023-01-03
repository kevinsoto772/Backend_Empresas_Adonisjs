export interface RespuestaWompiTransaccion {
    data: Data;
    meta: Meta;
}

export interface Data {
    id:                  string;
    created_at:          Date;
    finalized_at:        null;
    amount_in_cents:     number;
    reference:           string;
    customer_email:      string;
    currency:            string;
    payment_method_type: string;
    payment_method:      PaymentMethod;
    status:              string;
    status_message:      null;
    billing_data:        null;
    shipping_address:    ShippingAddress;
    redirect_url:        null;
    payment_source_id:   null;
    payment_link_id:     null;
    customer_data:       CustomerData;
    bill_id:             null;
    taxes:               any[];
}

export interface CustomerData {
    legal_id:      string;
    full_name:     string;
    phone_number:  string;
    legal_id_type: string;
}

export interface PaymentMethod {
    type:                string;
    user_type:           string;
    sandbox_status:      string;
    payment_description: string;
}

export interface ShippingAddress {
    address_line_1: string;
    address_line_2: string;
    country:        string;
    region:         string;
    city:           string;
    name:           string;
    phone_number:   string;
    postal_code:    string;
}

export interface Meta {
}
