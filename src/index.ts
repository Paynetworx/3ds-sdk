export const CHALLENGE_WINDOW_SIZE_250_400 = "01"
export const CHALLENGE_WINDOW_SIZE_390_400 = "02"
export const CHALLENGE_WINDOW_SIZE_500_600 = "03"
export const CHALLENGE_WINDOW_SIZE_600_400 = "04"
export const CHALLENGE_WINDOW_SIZE_Full_screen = "05"

export async function GatherBrowserData(window_size: string, echo_url: string) {
  const response = await fetch(echo_url, {
    method:'POST'
  })
  const data = await response.json() as {
    id: string
  }

  return {
    browserJavaEnabled: navigator.javaEnabled,
    browserLanguage: navigator.language,
    browserColorDepth: screen.colorDepth.toString(),
    browserScreenHeight: screen.height.toString(),
    browserScreenWidth: screen.width.toString(),
    browserTZ:  (new Date()).getTimezoneOffset().toString(),
    challengeWindowSize:  window_size.toString(),
    browser_info_id: data.id
  }
}

export interface Submit3dsMethodArgs {
  threeDSServerTransID: string
  threeDSMethodNotificationURL: string
  threeDSMethodURL: string
  parentElement?: HTMLElement
}
export async function Submit3dsMethod(args: Submit3dsMethodArgs){
  let iframe = document.createElement('iframe');
  iframe.style.display="none"
  iframe.name = "threeDSMethodIframe";

  const parent_element = args.parentElement || document.body
  parent_element.appendChild(iframe);

  let threeDSMethodData = {
    threeDSServerTransID: args.threeDSServerTransID,
    threeDSMethodNotificationURL: args.threeDSMethodNotificationURL
  };
   
  let form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', args.threeDSMethodURL);
  form.setAttribute('target', 'threeDSMethodIframe');

  let input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'threeDSMethodData');
  input.value = base64url(JSON.stringify(threeDSMethodData));
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

export interface SubmitChallengeArgs {
  acsURL: string
  encodedCReq: string
  parentElement?: HTMLElement
}

export async function SubmitChallenge(args: SubmitChallengeArgs){
  let challenge_iframe = document.createElement('iframe');
  challenge_iframe.name = "challengeIframe";
  
  const parent_element = args.parentElement || document.body
  parent_element.appendChild(challenge_iframe);
  
  let form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', args.acsURL);
  form.setAttribute('target', challenge_iframe.name);

  let input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'creq');
  input.value = args.encodedCReq;
  form.appendChild(input);

  parent_element.appendChild(form);
  form.submit();
}


export function base64url(input: string) {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


export interface CallbackResponse<T> {
    threeDSServerTransID: string
    MethodData?:{
      threeDSMethodURL?: string
      threeDSMethodNotificationURL?: string
    },
    challengeData?:{
      CompleteAuthChallengeURL: string
      acsURL: string
      acsChallengeMandated: string
      encodedCReq: string
    },
    PaymentResponse?:T
}


export async function processPayment<T>(args: {
  paynetworx_url: string
  challenge_window_size: string
  sendPaymentToBackend: (browser_info: unknown) => Promise<CallbackResponse<T>>
  Get3dsMethodResponse: (threeDSServerTransID: string) => Promise<CallbackResponse<T>>
  GetChallengeResponse: (threeDSServerTransID: string) => Promise<CallbackResponse<T>>
}): Promise<T | undefined>{
    const browser_info=await GatherBrowserData(args.challenge_window_size,`${args.paynetworx_url}/browser_info`)
    let challenge_required = false

    const backend_payment_response = await args.sendPaymentToBackend(browser_info) 
  
    let acsURL: string = ""
    let encodedCreq: string = ""

    let out: T | undefined
    if(backend_payment_response.MethodData){
      await Submit3dsMethod({
        threeDSServerTransID: backend_payment_response.threeDSServerTransID,
        threeDSMethodNotificationURL: backend_payment_response.MethodData.threeDSMethodNotificationURL!,
        threeDSMethodURL: backend_payment_response.MethodData.threeDSMethodURL!,
      })

      const threeds_method_response_data=await args.Get3dsMethodResponse(backend_payment_response.threeDSServerTransID)
    
      if(threeds_method_response_data.challengeData){
        challenge_required = true
        acsURL = threeds_method_response_data.challengeData.acsURL
        encodedCreq = threeds_method_response_data.challengeData.encodedCReq
      }else{
        out = threeds_method_response_data.PaymentResponse
      }
    }else{
      if(backend_payment_response.challengeData){
        challenge_required = true
        acsURL = backend_payment_response.challengeData.acsURL
        encodedCreq = backend_payment_response.challengeData.encodedCReq
      }else{
        challenge_required = false
        out = backend_payment_response.PaymentResponse
      }
    }

    if(challenge_required){
      await SubmitChallenge({
        acsURL: acsURL,
        encodedCReq: encodedCreq
      })
      const challenge_response = await args.GetChallengeResponse(backend_payment_response.threeDSServerTransID)
      out = challenge_response.PaymentResponse
    }    
    return out
};


