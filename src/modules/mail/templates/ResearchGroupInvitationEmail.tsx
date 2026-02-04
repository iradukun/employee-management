interface ResearchGroupInvitationEmailProps {
  inviteeName?: string;
  groupName: string;
  inviterName: string;
  message?: string;
  invitationLink: string;
}

export const ResearchGroupInvitationEmail = ({
  inviteeName,
  groupName,
  inviterName,
  message,
  invitationLink,
}: ResearchGroupInvitationEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        backgroundColor: '#f4f6f8',
        padding: '40px 20px',
        color: '#1f2937',
        lineHeight: '1.6',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          padding: '30px 25px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '25px',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <a
            href="https://gradvers.com"
            style={{ textDecoration: 'none', color: '#1e3a8a' }}
          >
            <div
              style={{
                fontSize: '22px',
                fontWeight: 600,
                marginTop: '8px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <img
                src="https://gradvers.com/_next/image?url=%2Flogo.png&w=64&q=75"
                alt="GradVerse Logo"
                width="50"
                height="50"
                style={{ borderRadius: '8px', objectFit: 'contain' }}
              />
              GradVerse
            </div>
          </a>
        </div>

        {/* Heading */}
        <h2
          style={{
            color: '#1e3a8a',
            textAlign: 'center',
            fontSize: '22px',
            marginBottom: '10px',
          }}
        >
          📩 Invitation to Join {groupName}
        </h2>

        {inviteeName && (
          <p style={{ marginTop: '12px' }}>
            Hello <strong>{inviteeName}</strong>,
          </p>
        )}

        <p style={{ marginTop: '8px' }}>
          <strong>{inviterName}</strong> has invited you to join the research
          group <strong>{groupName}</strong>.
        </p>

        {message && (
          <blockquote
            style={{
              fontStyle: 'italic',
              backgroundColor: '#f9fafb',
              borderLeft: '4px solid #f97316',
              padding: '12px 16px',
              margin: '20px 0',
              borderRadius: '8px',
              color: '#374151',
            }}
          >
            “{message}”
          </blockquote>
        )}

        <p>Click the button below to view or accept your invitation:</p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={invitationLink}
            style={{
              backgroundColor: '#f97316',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block',
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            Join Group 🚀
          </a>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '30px',
            textAlign: 'center',
          }}
        >
          If the button doesn’t work, copy and paste this link into your
          browser:
          <br />
          <a
            href={invitationLink}
            style={{
              color: '#2563eb',
              wordBreak: 'break-all',
              textDecoration: 'none',
            }}
          >
            {invitationLink}
          </a>
        </p>

        <p
          style={{
            marginTop: '40px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#4b5563',
          }}
        >
          Best regards,
          <br />
          <strong>The GradVerse Team</strong>
        </p>
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '20px',
        }}
      >
        © {new Date().getFullYear()} GradVerse. All rights reserved.
      </div>
    </div>
  );
};
