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

}
export async function Submit3dsMethod(args: Submit3dsMethodArgs){
  let iframe = document.createElement('iframe');
  iframe.style.display="none"
  iframe.name = "threeDSMethodIframe";
  document.body.appendChild(iframe);
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
}

export async function SubmitChallenge(args: SubmitChallengeArgs){
  let challenge_iframe = document.createElement('iframe');
  challenge_iframe.name = "challengeIframe";
  document.body.appendChild(challenge_iframe);
  
  let form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', args.acsURL);
  form.setAttribute('target', challenge_iframe.name);

  let input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'creq');
  input.value = args.encodedCReq;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}


export function base64url(input: string) {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
