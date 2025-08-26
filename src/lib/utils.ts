import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSigninEmailTemplate = (signInLink: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In to Your Account</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .email-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
        }

        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 20px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 16px 0;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 18px;
            color: #6b7280;
            margin: 0 0 32px 0;
            line-height: 1.5;
        }

        .message {
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
            margin: 0 0 32px 0;
            text-align: left;
        }

        .signin-button {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.4);
            transition: all 0.2s ease;
            margin: 0 0 32px 0;
        }

        .signin-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px -5px rgba(251, 191, 36, 0.5);
        }

        .security-note {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin: 32px 0;
            text-align: left;
        }

        .security-note h4 {
            margin: 0 0 8px 0;
            color: #d97706;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .security-note p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin: 8px 0;
            line-height: 1.5;
        }

        .footer a {
            color: #d97706;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px 10px;
            }

            .email-card {
                padding: 30px 20px;
            }

            .title {
                font-size: 24px;
            }

            .subtitle {
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="email-card">
            <div class="logo">✨</div>

            <h1 class="title">Welcome Back!</h1>
            <p class="subtitle">Sign in to your account securely</p>

            <div class="message">
                <p>Hello there! 👋</p>
                <p>You requested to sign in to your account. Click the button below to access your dashboard securely
                    without needing to remember your password.</p>
            </div>

            <a href=${signInLink} class="signin-button">
                🔐 Sign In Securely
            </a>

            <div class="security-note">
                <h4>🛡️ Security Notice</h4>
                <p>This magic link will expire in 24 hours for your security. If you didn't request this sign-in link,
                    you can safely ignore this email.</p>
            </div>

            <div class="footer">
                <p>This link will take you directly to your account dashboard.</p>
                <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
                <p><a href=${signInLink}>${signInLink}</a></p>
                <p style="margin-top: 24px;">
                    <strong>Need help?</strong> Contact our support team<br>
                    This email was sent because you requested to sign in to your account.
                </p>
            </div>
        </div>
    </div>
</body>

</html>`;

export const getSignupEmailTemplate = (signUpLink: string) =>
  `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Your Account</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
            min-height: 100vh;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .email-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(251, 191, 36, 0.2);
            text-align: center;
        }

        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 20px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .title {
            font-size: 28px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 16px;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 18px;
            color: #b45309;
            margin-bottom: 32px;
            line-height: 1.5;
        }

        .message {
            font-size: 16px;
            color: #78716c;
            line-height: 1.6;
            margin-bottom: 32px;
            text-align: left;
            background: rgba(251, 191, 36, 0.1);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #fbbf24;
        }

        .signup-button {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.4);
            transition: all 0.3s ease;
            margin-bottom: 32px;
            cursor: pointer;
        }

        .signup-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px -5px rgba(251, 191, 36, 0.5);
        }

        .info-text {
            font-size: 14px;
            color: #a8a29e;
            line-height: 1.5;
            margin-bottom: 24px;
        }

        .footer {
            font-size: 12px;
            color: #a8a29e;
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(251, 191, 36, 0.2);
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent);
            margin: 32px 0;
        }

        @media (max-width: 600px) {
            .email-container {
                padding: 20px 10px;
            }

            .email-card {
                padding: 30px 20px;
            }

            .title {
                font-size: 24px;
            }

            .subtitle {
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-card">
            <div class="logo">A</div>

            <h1 class="title">Welcome to Our Platform!</h1>
            <p class="subtitle">You're just one step away from getting started</p>

            <div class="message">
                <strong>Account Required:</strong> We noticed you don't have an account on our platform yet. To access
                our services and enjoy all the features we offer, you'll need to create an account first.
            </div>

            <a href=${signUpLink} class="signup-button">
                Create Account
            </a>

            <p class="info-text">
                Once you create your account, you'll be able to access all our features and start your journey with us.
                The signup process is quick and easy!
            </p>

            <div class="divider"></div>

            <p class="info-text">
                If you're having trouble with the button above, copy and paste this link into your browser:<br>
                <span style="color: #f59e0b; word-break: break-all;">${signUpLink}</span>
            </p>

            <div class="footer">
                <p>This invitation was sent to you because someone tried to access our platform with your email address.
                </p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>&copy; 2025 The Date Crew. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>

</html>
  `;
