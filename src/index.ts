import express, { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>HI, sup?!</h1>
    </div>
  `)
})

app.listen(8000, () => {
  console.log('listening on port 8000')
})
