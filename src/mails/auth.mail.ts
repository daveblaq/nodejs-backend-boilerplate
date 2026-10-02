/**
 * AgroNext Institutional Farmland RWA Platform
 * Transactional Email Templates: Clean White Mode, No Card Background, No Border Radius
 */

export const getOtpEmailTemplate = (name: string, otp: string) => {
  const recipientName = name && name.trim() ? name.trim().split(' ')[0] : 'Investor';

  return {
    header: `${otp} is your AgroNext verification code`,
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgroNext Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased; line-height: 1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; width: 100%; border: 0;">
    <tr>
      <td align="left" style="padding: 40px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 540px; width: 100%; margin: 0 auto; border: 0;">
          <!-- Brand Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
              <span style="font-size: 18px; font-weight: 800; letter-spacing: 1.5px; color: #0D1F14; text-transform: uppercase;">AGRO<span style="color: #8C6212;">NEXT</span></span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827; line-height: 1.3;">Verification Code</h1>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Hello ${recipientName},
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Use the 6-digit code below to finish signing in to your AgroNext account:
              </p>

              <!-- OTP Code Display: Simple, white mode, no radius, no card -->
              <div style="margin: 28px 0; padding: 16px 20px; background-color: #F9FAFB; border: 1px solid #E5E7EB; text-align: center;">
                <div style="font-family: 'SF Mono', Consolas, 'Courier New', monospace; font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #0D1F14; padding-left: 10px;">
                  ${otp}
                </div>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #6B7280; line-height: 1.6;">
                This code expires in <strong>10 minutes</strong>. For your security, never share this code with anyone. AgroNext staff will never ask for your code.
              </p>

              <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.6;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                AgroNext African Farmland Investment Platform
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                &copy; 2026 AgroNext Technologies. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
};

export const getWelcomeEmailTemplate = (fullName: string) => {
  const firstName = fullName && fullName.trim() ? fullName.trim().split(' ')[0] : 'there';

  return {
    header: 'Welcome to AgroNext | Your Farmland Account is Ready',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AgroNext</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased; line-height: 1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; width: 100%; border: 0;">
    <tr>
      <td align="left" style="padding: 40px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 540px; width: 100%; margin: 0 auto; border: 0;">
          <!-- Brand Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
              <span style="font-size: 18px; font-weight: 800; letter-spacing: 1.5px; color: #0D1F14; text-transform: uppercase;">AGRO<span style="color: #8C6212;">NEXT</span></span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827; line-height: 1.3;">Welcome to AgroNext</h1>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Hello ${firstName},
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Your account is ready! You now have direct access to verified African farmland offerings, live harvest monitoring, and quarterly harvest returns sent straight to your wallet.
              </p>

              <!-- Simple feature list: No card background, no radius -->
              <div style="margin: 24px 0; padding: 18px 0; border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #111827; line-height: 1.5;">
                  <strong>Verified Farmland:</strong> Legally backed title deeds across commercial acreage in Nigeria, Ghana, Kenya, and Rwanda.
                </p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #111827; line-height: 1.5;">
                  <strong>Insured Crops:</strong> Every planting cycle is fully insured against weather and pest risks.
                </p>
                <p style="margin: 0; font-size: 14px; color: #111827; line-height: 1.5;">
                  <strong>Quarterly Payouts:</strong> Automated USDC harvest profits delivered directly to your wallet.
                </p>
              </div>

              <!-- Simple button: No border radius -->
              <div style="margin: 32px 0 20px 0;">
                <a href="http://localhost:3000/portfolio" style="background-color: #0D1F14; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 13px 26px; display: inline-block; border-radius: 0;">
                  Go to Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                AgroNext African Farmland Investment Platform
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                &copy; 2026 AgroNext Technologies. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
};

export interface LoginActivityOptions {
  method?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: Date;
  dashboardUrl?: string;
}

const parseUserAgent = (ua?: string): string => {
  if (!ua) return 'Web Browser';
  let os = 'Unknown OS';
  if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';

  return `${browser} on ${os}`;
};

export const getLoginActivityEmailTemplate = (
  fullName: string,
  options: LoginActivityOptions = {}
) => {
  const firstName = fullName && fullName.trim() ? fullName.trim().split(' ')[0] : 'there';
  const method = options.method || 'Authentication Verification';
  const timestamp = options.timestamp || new Date();
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC',
  }).format(timestamp) + ' UTC';

  let cleanIp = options.ip || 'Local / Secure Gateway';
  if (cleanIp === '::1' || cleanIp.includes('127.0.0.1')) {
    cleanIp = '127.0.0.1 (Local Session)';
  } else if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.replace('::ffff:', '');
  }

  const deviceInfo = parseUserAgent(options.userAgent);
  const dashboardUrl = options.dashboardUrl || process.env.FRONTEND_URL || 'http://localhost:3000';

  return {
    header: 'New Sign-in to Your AgroNext Account',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Sign-in Notice</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased; line-height: 1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; width: 100%; border: 0;">
    <tr>
      <td align="left" style="padding: 40px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 540px; width: 100%; margin: 0 auto; border: 0;">
          <!-- Brand Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
              <span style="font-size: 18px; font-weight: 800; letter-spacing: 1.5px; color: #0D1F14; text-transform: uppercase;">AGRO<span style="color: #8C6212;">NEXT</span></span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827; line-height: 1.3;">New Sign-in Notice</h1>
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                Hello ${firstName},
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                We noticed a new sign-in to your AgroNext account. Here are the details:
              </p>

              <!-- Activity Details Table: White mode, clean borders, no radius, no card -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 24px 0; border: 1px solid #E5E7EB; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #6B7280; width: 35%; background-color: #F9FAFB;">
                    Sign-in Method
                  </td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827; background-color: #ffffff;">
                    ${method}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #6B7280; background-color: #F9FAFB;">
                    Date & Time
                  </td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #111827; background-color: #ffffff;">
                    ${formattedTime}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #6B7280; background-color: #F9FAFB;">
                    Device / Browser
                  </td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #111827; background-color: #ffffff;">
                    ${deviceInfo}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #6B7280; background-color: #F9FAFB;">
                    IP Address
                  </td>
                  <td style="padding: 12px 16px; font-size: 14px; font-family: monospace; color: #111827; background-color: #ffffff;">
                    ${cleanIp}
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 16px 0; font-size: 14px; color: #374151; line-height: 1.6;">
                <strong>Was this you?</strong> If so, you can disregard this email. No further action is required.
              </p>

              <p style="margin: 0 0 28px 0; font-size: 14px; color: #DC2626; line-height: 1.6;">
                <strong>Wasn&apos;t you?</strong> If you didn&apos;t sign in, please check your account security immediately or contact our team at <a href="mailto:support@agronext.io" style="color: #DC2626; text-decoration: underline;">support@agronext.io</a>.
              </p>

              <!-- Simple CTA Button: No border radius -->
              <div style="margin: 28px 0;">
                <a href="${dashboardUrl}/settings" style="background-color: #0D1F14; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; display: inline-block; border-radius: 0;">
                  Review Account Security &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                AgroNext African Farmland Investment Platform
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                &copy; 2026 AgroNext Technologies. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
};