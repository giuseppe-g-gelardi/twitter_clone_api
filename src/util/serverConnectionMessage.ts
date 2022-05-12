import colors from 'colors'

colors.enable()

export default function serverConnectionMessage(serverPort: string): void {
  console.log(`=====================================`.rainbow)
  console.log("🚀" + " " + "App listening on the port:".dim + " " + `${serverPort}`.italic.cyan + " " + "🚀")
  console.log(`=====================================`.rainbow)
}
