# HomeLab Hub - Personal Cloud Management Portal

A beautiful, modern web interface for managing your personal homelab services. Replace expensive cloud subscriptions with your own private cloud ecosystem.

## 🚀 Features

### For Users
- **Cost-Effective**: Replace Netflix ($17), HBO Max ($16), Google Photos ($10), and more for just $15/month
- **Secure Access**: Military-grade VPN access through Tailscale integration
- **Media Streaming**: Full Plex media server access with request system
- **Photo Management**: Unlimited photo storage with Immich (Google Photos alternative)
- **Recipe Organization**: Meal planning and recipe management with Mealie
- **Issue Reporting**: Easy support system for all services

### For Administrators
- **User Management**: Create and manage user accounts with custom permissions
- **Access Control**: Generate unique access codes for each user
- **Custom Pages**: Generate personalized service pages per user
- **Tailscale Onboarding**: Automated VPN setup package generation
- **Billing Overview**: Track subscriptions and revenue
- **Service Permissions**: Granular control over user access (Plex, Immich, Mealie)

## 🛠️ Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to repository Settings → Pages
3. Set source to "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/homelab-hub.git
   cd homelab-hub
   ```

2. Open `index.html` in your browser or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Access at `http://localhost:8000`

## 🔐 Default Access Codes

### Admin Access
- **Code**: `ADMIN2024`
- **Permissions**: Full administrative access

### Demo User Accounts
- **Code**: `MOVIES2024` (John Doe - All services)
- **Code**: `PHOTOS2024` (Jane Smith - Immich + Mealie only)

## 📱 Usage Guide

### For End Users
1. Visit your HomeLab Hub website
2. Click "Get Access" to request an account
3. Once approved, use your access code to log in
4. Access your personalized dashboard with available services
5. Request movies/TV shows for Plex
6. Report issues with any service
7. Download Tailscale setup instructions

### For Administrators
1. Log in with admin code `ADMIN2024`
2. **Users Tab**: Manage user accounts and permissions
3. **Access Codes Tab**: Generate and revoke access codes
4. **Tailscale Tab**: Create onboarding packages for users
5. **Billing Tab**: View revenue and subscription overview

## 🎨 Customization

### Branding
- Edit `index.html` to change the site title and branding
- Modify `styles.css` to adjust colors and styling
- Update service URLs in `script.js` to point to your actual services

### Service Configuration
Edit the `sampleUsers` array in `script.js` to set up your initial users:

```javascript
const sampleUsers = [
    {
        id: 1,
        name: 'Your Name',
        email: 'your@email.com',
        accessCode: 'YOUR_CODE',
        permissions: ['plex', 'immich', 'mealie'],
        joinDate: '2024-01-15',
        billing: 'active'
    }
];
```

### Admin Access
Change the admin code in `script.js`:

```javascript
const adminCode = 'YOUR_SECURE_ADMIN_CODE';
```

## 🌐 Service Integration

### Plex Media Server
- Update Plex URLs in the dashboard
- Configure request system to integrate with your media management tools

### Immich Photos
- Point to your Immich instance
- Ensure proper authentication setup

### Mealie Recipes
- Connect to your Mealie installation
- Configure recipe sharing and meal planning features

### Tailscale VPN
- Set up Tailscale auth keys for automatic onboarding
- Configure service URLs for internal network access

## 🎯 Value Proposition

### Traditional Services Cost:
- Netflix: $17/month
- HBO Max: $16/month  
- Google Photos: $10/month
- Spotify: $11/month
- **Total: $54/month**

### HomeLab Hub Alternative:
- Unlimited movies & TV (Plex)
- Unlimited photo storage (Immich)
- Recipe management (Mealie)
- Secure private access (Tailscale)
- **Total: $15/month**

**Monthly Savings: $39 per user**

## 🔧 Technical Details

### Frontend
- Pure HTML, CSS, and JavaScript (no framework dependencies)
- Responsive design with mobile support
- Modern gradients and animations
- Font Awesome icons

### Features
- Modal-based interface
- Local storage for demo purposes
- Responsive grid layouts
- Smooth animations and transitions

### Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers

## 🚀 Deployment Options

### GitHub Pages
Perfect for static hosting with automatic updates from your repository.

### Self-Hosted
Deploy on your own server:
- Nginx/Apache
- Docker container
- Vercel/Netlify

### CDN
Use with any CDN service for global distribution.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues page
2. Create a new issue with detailed information
3. Include browser console errors if applicable

## 🔄 Roadmap

- [ ] Backend integration for user persistence
- [ ] Email notifications for requests/issues
- [ ] Payment processing integration
- [ ] Advanced user analytics
- [ ] Mobile app companion
- [ ] API endpoints for service integration

---

**Made with ❤️ for the HomeLab community** 