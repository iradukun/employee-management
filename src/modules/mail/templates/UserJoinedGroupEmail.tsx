interface UserJoinedGroupEmailProps {
  fullName: string;
  groupName: string;
  inviterName: string;
}

export const UserJoinedGroupEmail = ({
  fullName,
  groupName,
  inviterName,
}: UserJoinedGroupEmailProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>🎉 Welcome to {groupName}!</h2>
      <p>Hi {fullName},</p>
      <p>
        You have successfully joined the research group{' '}
        <strong>{groupName}</strong>.
      </p>
      <p>
        <strong>{inviterName}</strong> invited you to collaborate with other
        researchers.
      </p>
      <p>
        We're excited to have you on board! You can now start sharing files,
        discussions, and ideas with your team.
      </p>
      <p>
        Best regards,
        <br />
        The GradVers Team
      </p>
    </div>
  );
};
