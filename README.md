# Next.js Team Registration App

A modern web application for student team registration and management, built with Next.js and integrated with Google Sheets for data persistence.

## 🚀 Features

- **User Authentication**: Secure login system using NextAuth.js
- **User Profile Management**: View and update personal profile information
- **Team Management**:
  - Create teams with invited members
  - Browse teams with available vacancies
  - Request to join teams
  - Team leader approval system for join requests
- **Google Sheets Integration**: Real-time data synchronization with Google Sheets
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Role-based Access**: Student and admin user roles
- **Dummy Data Population**: Development utility to populate test data

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Google Sheets API
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- Google Cloud Project with Sheets API enabled
- Service account credentials for Google Sheets

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-sheets-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Google Sheets Integration**

   a. Create a Google Cloud Project and enable the Google Sheets API

   b. Create a service account and download the JSON key file

   c. Place the service account JSON file in the project root as `service-account.json`

   d. Create a new Google Sheet and copy its ID

4. **Environment Variables**

   Create a `.env.local` file in the root directory:

   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key

   # Google Sheets Configuration
   GOOGLE_SHEETS_ID=your-google-sheet-id

   # Database URL (if using additional database)
   DATABASE_URL=your-database-url
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### For Students

1. **Register**: Create an account with your student details
2. **Login**: Authenticate to access the dashboard
3. **Create Team**: Form a team and invite members via email
4. **Join Team**: Browse available teams and request to join
5. **Manage Team**: View team details and member status

### For Team Leaders

1. **Approve Requests**: Review and approve/deny join requests from the dashboard
2. **Monitor Team**: Track team vacancies and member count

### For Admins

1. **View All Teams**: Access comprehensive team and student data
2. **System Management**: Oversee all registrations and teams

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Students
- `POST /api/students/register` - Register new student

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

### Teams
- `POST /api/teams/create` - Create a new team
- `GET /api/teams/list` - List all teams (filtered for students)
- `POST /api/teams/request-join` - Request to join a team
- `POST /api/teams/approve-request` - Approve or deny join requests

### Development
- `POST /api/populate` - Populate dummy data (development only)

### Health Check
- `GET /api/health` - Application health status

## 📁 Project Structure

```
nextjs-sheets-app/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication
│   │   ├── students/             # Student management
│   │   ├── teams/                # Team operations
│   │   └── health/               # Health checks
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   └── registered-teams/         # Team browsing
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   └── ...                       # Custom components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication config
│   ├── google-sheets.ts          # Sheets integration
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
└── styles/                       # Global styles
```

## 🔒 Security

- Environment variables are used for sensitive configuration
- Service account credentials are excluded from version control
- Authentication is handled securely via NextAuth.js
- API routes include proper authorization checks

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Set the following in Vercel dashboard:
   - `GOOGLE_SHEETS_ID`: Your Google Sheet ID
   - `GOOGLE_SERVICE_ACCOUNT`: The entire service account JSON as a string
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `ADMIN_EMAIL`: (Optional) Admin email for admin login
   - `ADMIN_PASSWORD`: (Optional) Admin password

3. **Deploy**: Vercel will automatically deploy on git push

### Other Platform Deployments

#### Netlify
1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Use the build command: `npm run build`
4. Publish directory: `.next`

#### Railway/DigitalOcean App Platform
1. Connect your GitHub repo
2. Set environment variables
3. Use Node.js runtime
4. Build command: `npm run build`
5. Start command: `npm start`

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Important Security Notes:**
- Never commit `.env.local` or any files containing real credentials
- Use environment variables in your deployment platform
- The Google service account JSON should be stored as a single-line JSON string in the `GOOGLE_SERVICE_ACCOUNT` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your Google Sheets API setup
3. Ensure all environment variables are set
4. Check the API response in browser dev tools

## 📊 Google Sheets Structure

The application uses three main sheets:

### Students Sheet
| Column | Description |
|--------|-------------|
| id | Unique student identifier |
| name | Student full name |
| regNo | Registration number |
| dept | Department |
| email | Email address |
| passwordHash | Hashed password |
| experienceLevel | Experience level |
| github | GitHub username |
| role | User role (student/admin) |
| createdAt | Registration timestamp |

### Teams Sheet
| Column | Description |
|--------|-------------|
| id | Unique team identifier |
| name | Team name |
| leaderId | Team leader's student ID |
| memberIds | JSON array of member IDs |
| vacancies | Available slots (max 5 + leader) |
| createdAt | Team creation timestamp |

### Join Requests Sheet
| Column | Description |
|--------|-------------|
| id | Unique request identifier |
| teamId | Target team ID |
| studentId | Requesting student ID |
| message | Optional message |
| status | Request status (pending/approved/denied) |
| createdAt | Request timestamp |

---

Built with ❤️ using Next.js and Google Sheets API