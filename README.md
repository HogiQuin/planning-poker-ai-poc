# Planning Poker - Scrum Estimation Tool

A collaborative Planning Poker application designed to streamline Scrum backlog refinement sessions. Built with AI assistance from V0 by Vercel, this tool enables distributed teams to estimate story points efficiently through real-time voting and consensus-building features.

## 🚀 Features

- **Real-time Collaboration**: Multiple team members can join sessions and vote simultaneously
- **Card-based Voting**: Classic Planning Poker cards (Fibonacci sequence) for story point estimation
- **Session Management**: Create and manage multiple estimation sessions
- **Reveal Mechanism**: Hide votes until all participants have voted, then reveal simultaneously
- **Consensus Building**: Visual indicators to help teams reach estimation consensus
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Firebase Integration**: Real-time database ensures instant updates across all participants

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React
- **Backend**: Firebase (Firestore Database, Authentication)
- **Styling**: Tailwind CSS
- **Real-time Updates**: Firebase Realtime Database
- **Deployment**: Vercel
- **AI Development**: Built with V0 by Vercel

## 📸 Screenshots

> **Note**: Add screenshots of your application here to showcase the user interface and key features.

```
[Session Creation Screen]
[Voting Interface]
[Results/Consensus View]
[Mobile Responsive View]
```

## 🏗️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planning-poker.git
   cd planning-poker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (optional, if using user accounts)
   - Copy your Firebase config

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Create a Session**: Start a new Planning Poker session and share the session ID with your team
2. **Join Session**: Team members join using the session ID
3. **Add Stories**: Input user stories or backlog items to estimate
4. **Vote**: Each participant selects their estimation card
5. **Reveal**: Once everyone has voted, reveal all votes simultaneously
6. **Discuss**: Use the results to facilitate discussion and reach consensus
7. **Record**: Save the agreed-upon story points and move to the next item

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices, allowing team members to participate in estimation sessions from anywhere.

## 🔧 Configuration

### Firebase Rules
Make sure to set up appropriate Firestore security rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

```

## 🚀 Deployment

This application is optimized for deployment on Vercel:

1. **Connect to Vercel**
   - Import your repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or use Vercel CLI: `vercel --prod`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with AI assistance from [V0 by Vercel](https://v0.dev)
- Inspired by the Planning Poker estimation technique
- Thanks to the Scrum and Agile communities for the methodology

## 🐛 Issues & Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/yourusername/planning-poker/issues) page
- Create a new issue with detailed description
- For general questions, use the [Discussions](https://github.com/yourusername/planning-poker/discussions) section

---


**Made with ❤️ and AI assistance for the Scrum community**