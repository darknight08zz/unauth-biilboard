# Billboard Detection and Reporting System


[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/prajapatiujjwal0802-1050s-projects/v0-billboarddetectionandreportingm)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/87YihF6FGZj)

## 🎯 Overview

A comprehensive web application for detecting and reporting unauthorized billboards using AI-powered analysis. This system helps municipal authorities and citizens identify billboard violations, ensure regulatory compliance, and maintain urban aesthetics through automated detection and reporting mechanisms.

## ✨ Features

### 🔍 Detection System
- **AI-Powered Analysis**: Automated detection of billboard violations using computer vision
- **Image/Video Upload**: Support for multiple file formats with drag-and-drop interface
- **Real-time Processing**: Instant analysis with violation flagging and compliance scoring
- **Geolocation Integration**: GPS-based location tracking for accurate reporting

### 👨‍💼 Admin Dashboard
- **Violation Management**: Comprehensive dashboard for reviewing and managing reports
- **Status Tracking**: Update investigation status and add notes to reports
- **Analytics & Insights**: Statistical analysis of violations by category and location
- **Export Functionality**: Generate reports and export data for regulatory purposes

### 🌍 Public Dashboard
- **Transparency Portal**: Public access to compliance statistics and trends
- **District-wise Data**: Breakdown of violations by geographic regions
- **Educational Content**: Information about billboard regulations and reporting process
- **Community Engagement**: Easy access to violation reporting for citizens

### 🔐 Authentication System
- **Role-based Access**: Different access levels for citizens, inspectors, and administrators
- **Secure Login**: Protected routes with session management
- **User Management**: Account creation and profile management

### 📋 Compliance Engine
- **Regulatory Database**: Comprehensive set of billboard regulations and standards
- **Automated Checks**: Real-time compliance verification against municipal codes
- **Risk Assessment**: Categorization of violations by severity and potential fines
- **Documentation**: Detailed compliance reports with regulatory references

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Authentication**: Custom auth system with role-based access control
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Fonts**: Space Grotesk, DM Sans via Google Fonts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/billboard-detection-system.git
   cd billboard-detection-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

### GitHub Codespaces

1. Click the "Code" button on GitHub
2. Select "Codespaces" tab
3. Click "Create codespace on main"
4. Run `npm install && npm run dev` in the terminal
5. Access the forwarded port 3000

## 📱 Usage Guide

### For Citizens
1. **Report Violations**: Upload images of suspected unauthorized billboards
2. **Provide Location**: Add GPS coordinates or manual location details
3. **Track Reports**: Monitor the status of submitted reports
4. **View Public Data**: Access transparency dashboard for community insights

### For Administrators
1. **Login**: Use admin credentials to access the dashboard
2. **Review Reports**: Examine submitted violation reports with AI analysis
3. **Update Status**: Change investigation status and add official notes
4. **Generate Reports**: Export data for regulatory compliance and reporting
5. **Monitor Trends**: Analyze violation patterns and compliance metrics

### Demo Accounts
- **Admin**: admin@city.gov / admin123
- **Inspector**: inspector@city.gov / inspector123  
- **Citizen**: citizen@email.com / citizen123

## 🗂️ Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── compliance/        # Compliance rules and regulations
│   ├── login/             # Authentication pages
│   ├── public-dashboard/  # Public transparency portal
│   └── unauthorized/      # Access denied page
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── auth-provider.tsx # Authentication context
│   └── protected-route.tsx # Route protection
├── lib/                  # Utility functions and configurations
│   └── compliance-engine.ts # Regulatory compliance logic
├── public/               # Static assets
└── styles/               # Global styles and Tailwind config
\`\`\`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
\`\`\`env
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette (cyan primary, neutral grays)
- Extended spacing and typography scales
- Component-specific utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

Your project is automatically deployed on Vercel:

**Live Demo**: [https://vercel.com/prajapatiujjwal0802-1050s-projects/v0-billboarddetectionandreportingm](https://vercel.com/prajapatiujjwal0802-1050s-projects/v0-billboarddetectionandreportingm)

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔄 Development Workflow

This repository stays in sync with [v0.app](https://v0.app):

1. **Build**: Continue development on [v0.app](https://v0.app/chat/projects/87YihF6FGZj)
2. **Deploy**: Changes are automatically pushed from v0.app
3. **Sync**: Repository updates trigger Vercel deployments

## 📞 Support

For issues and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

Built with ❤️ using [v0.app](https://v0.app) and deployed on [Vercel](https://vercel.com)
