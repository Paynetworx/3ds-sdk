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
