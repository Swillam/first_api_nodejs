import express from 'express'
import routes from './routes'

export function launch(port = 4242) {
  const application = express()

  // For parsing application/json
  application.use(express.json());
  
  // For parsing application/x-www-form-urlencoded
  application.use(express.urlencoded({ extended: true }));

  /** Routes */
  application.use('/', routes)
    
  application.listen(port, () => {
    console.log(`API started at: http://localhost:${port}/graphql`)
  })
}
