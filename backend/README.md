# Delta Backend

This backend provides CRUD endpoints for tenders and uploads files to Cloudinary, storing records in MongoDB Atlas.

Environment variables

- `MONGO_URI` - MongoDB Atlas connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
- `PORT` - optional (default 5000)

Install and run

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your credentials
npm run dev
```

API endpoints

- `GET /api/tenders` - list tenders
- `POST /api/tenders` - create tender (multipart/form-data) — supports files: `passport`, `aadhar`, `pan`, `gstCert`, `licenseCert`
- `PUT /api/tenders/:id` - update tender (multipart/form-data)
- `DELETE /api/tenders/:id` - delete tender
