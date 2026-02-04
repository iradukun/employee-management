import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { TailwindWrapper } from './Tailwind';

interface ResetPasswordEmailProps {
  resetCode: string;
  fullName: string;
}

export const ResetPasswordEmail = ({
  resetCode,
  fullName,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body className="bg-[#f6f9fc] font-sans">
        <TailwindWrapper>
          <Container className="bg-white mx-auto py-5 pb-12 mb-16">
            <div className="flex items-center mb-8">
              <Img
                src="cid:logo-image"
                width="25"
                height="25"
                alt="GradVers Logo"
                className="object-contain"
              />
              <span className="text-2xl font-bold text-[#2D2D2D] ml-2">
                GradVers
              </span>
            </div>
            <Heading className="text-primary text-2xl font-bold my-10 text-center">
              Password Reset
            </Heading>
            <Text className="text-[#333] text-base my-6">
              Hello {fullName},
            </Text>
            <Text className="text-[#333] text-base my-6">
              You requested a password reset. Please use the code below to reset
              your password:
            </Text>
            <Section className="bg-[#f4f4f4] rounded p-3.5 my-4 text-center">
              <Text className="text-primary text-3xl font-bold tracking-widest">
                {resetCode}
              </Text>
            </Section>
            <Text className="text-[#333] text-base my-6">
              If you didn't request this password reset, please ignore this
              email.
            </Text>
            <Text className="text-[#898989] text-sm mt-8">
              Best regards,
              <br />
              The Team
            </Text>
          </Container>
        </TailwindWrapper>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;
