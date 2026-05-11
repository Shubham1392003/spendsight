interface ReportEmailProps {
  tool: string;
  monthlySavings: number;
  yearlySavings: number;
  reportUrl: string;
}

export function ReportEmail({ tool, monthlySavings, yearlySavings, reportUrl }: ReportEmailProps) {
  return `
    <div style="background-color: #000000; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #050505; border: 1px solid #222222; border-radius: 16px; padding: 40px;">
        <h1 style="font-size: 28px; margin: 0 0 20px; letter-spacing: -0.05em; color: #ffffff;">Your AI Audit is Ready</h1>
        
        <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
          We've completed the analysis of your <strong>${tool}</strong> infrastructure. Our engine has identified significant optimization opportunities without compromising your team's velocity.
        </p>
        
        <div style="background-color: #111111; padding: 30px; border-radius: 12px; margin-bottom: 40px;">
          <div style="display: inline-block; width: 48%; text-align: left;">
            <div style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Monthly Savings</div>
            <div style="font-size: 32px; font-weight: bold; color: #ffffff;">$${monthlySavings.toLocaleString()}</div>
          </div>
          <div style="display: inline-block; width: 48%; text-align: left;">
            <div style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Yearly Projection</div>
            <div style="font-size: 32px; font-weight: bold; color: #ffffff;">$${yearlySavings.toLocaleString()}</div>
          </div>
        </div>

        <a href="${reportUrl}" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 16px 36px; border-radius: 30px; font-weight: 600; font-size: 16px;">
          View Full Report
        </a>
        
        <p style="color: #525252; font-size: 12px; margin-top: 40px;">
          SpendSight AI — Enterprise Grade Infrastructure Audits
        </p>
      </div>
    </div>
  `;
}
