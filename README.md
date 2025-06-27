# Paynetworx 3DS SDK

A JavaScript SDK for integrating 3D Secure (3DS) authentication into your payment processing applications. for more information see: https://docs.paynetworx.com/3ds/overview/getting-started-guide.html

## Overview

The Paynetworx 3DS SDK provides developers with a streamlined way to implement 3D Secure authentication flows in their applications. 3D Secure is a security protocol that adds an additional layer of authentication for online credit and debit card transactions, helping to reduce fraud and increase payment security.

## Installation

Install the SDK using npm:

```bash
npm install @paynetworx/3ds-sdk
```

## Features

- **Complete 3DS 2.0 Support**: Full implementation of the latest 3D Secure protocol
- **Easy Integration**: Simple API for quick implementation
- **Secure Authentication**: Enhanced security for online card transactions
- **Lightweight**: Minimal footprint with essential functionality
- **TypeScript Support**: Built with modern JavaScript/TypeScript

## Quick Start

```javascript
import * as sdk from "@paynetworx/3ds-sdk"

const result = await sdk.processPayment({
  paynetworx_url:"<given to you by paynetworx rep>",
  challenge_window_size:sdk.CHALLENGE_WINDOW_SIZE_500_600,
  sendPaymentToBackend: async (browser_info: unknown): Promise<sdk.CallbackResponse<unknown>> => {
    //example implemntation but yours will depend on your backend
    const response = await fetch(`${backend_url}/api/auth`,{
      method:'POST',
      body:JSON.stringify(paymentDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })

    // may need to edit to fit into sdk.CallbackResponse<unknown> shape
    return await response.json() 
  },
  Get3dsMethodResponse: async (threeDSServerTransID: string): Promise<sdk.CallbackResponse<unknown>> => {
    //example implemntation but yours will depend on your backend
    const threeds_method_response = await fetch(`${backend_url}/api/3ds_method/${threeDSServerTransID}`,{
      method:'GET',
    })

    return await threeds_method_response.json()
    // may need to edit to fit into sdk.CallbackResponse<unknown> shape
  },
  StartChallengeCallback: async () =>{
    //example implemntation but yours will depend on your backend
    await waitForElement("#challenge-modal");
    return document.getElementById("challenge-modal")!
  },
  GetChallengeResponse: async (threeDSServerTransID: string): Promise<sdk.CallbackResponse<unknown>> => {
    //example implemntation but yours will depend on your backend

    const challenge_response = await fetch(`${backend_url}/api/challenge/${threeDSServerTransID}`,{
      method:'GET',
    })
    return await challenge_response.json()
    // may need to edit to fit into sdk.CallbackResponse<unknown> shape
  },
  FinishChallengeCallback: async () =>{
    //clean up
  },
})
```

## Examples

For complete implementation examples, check out the [3DS Merchant Example](https://github.com/Paynetworx/3ds-merchant-example) repository, which demonstrates:

- Frontend payment form integration
- Backend API implementation
- Complete 3DS flow handling
- Docker deployment setup

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

**Note**: This SDK is designed for secure payment processing. Always follow PCI-DSS compliance requirements and use HTTPS in production environments.
