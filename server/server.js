import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks} from './controllers/webhooks.js'

import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'


const app = express()

//  Connect DB & Cloudinary
await connectDB()
await connectCloudinary()

//  Middlewares
app.use(cors())

// JSON parser FIRST
app.use(express.json())
app.use(clerkMiddleware())
// RAW only for specific webhook (Clerk)
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks)
// app.get('/',(req,res)=> res.send("API Working"))
// app.get('/debug-sentry', function mainHandler(req,res){
//   throw new Error("My first Sentry error!");
// });


// Routes (multer wale)
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Test route
app.get('/', (req, res) => res.send("API Working"))
// app.use('/api/jobs', )
// Sentry error handler (last mein)
Sentry.setupExpressErrorHandler(app)
// optionally: app.use(Sentry.expressErrorHandler())

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


