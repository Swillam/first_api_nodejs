import { Router } from 'express'
import graphql from './graphql'

const router = Router()

router.use('/graphql', graphql)

export default router
