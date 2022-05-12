import colors from 'colors'

colors.enable()

export default function dbConnectionMessage(dbHost: string): void {
  console.log(`=====================================`.rainbow)
  console.log(`🚀  MongoDB connection successful  🚀`.cyan)
  console.log(`            Connected @:`.dim)
  console.log(`${dbHost}`.italic.gray)
  console.log(`=====================================`.rainbow)
}
