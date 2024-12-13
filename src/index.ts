export const CHALLENGE_WINDOW_SIZE_250_400 = "01"
export const CHALLENGE_WINDOW_SIZE_390_400 = "02"
export const CHALLENGE_WINDOW_SIZE_500_600 = "03"
export const CHALLENGE_WINDOW_SIZE_600_400 = "04"
export const CHALLENGE_WINDOW_SIZE_Full_screen = "05"

export function GatherBrowserData(window_size: string) {
  return {
    browserJavaEnabled: navigator.javaEnabled,
    browserLanguage: navigator.language,
    browserColorDepth: screen.colorDepth.toString(),
    browserScreenHeight: screen.height.toString(),
    browserScreenWidth: screen.width.toString(),
    browserTZ:  (new Date()).getTimezoneOffset(),
    challengeWindowSize:  window_size.toString()
  }
}
