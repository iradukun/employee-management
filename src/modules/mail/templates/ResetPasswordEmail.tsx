import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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
      <Body className="bg-gray-100 font-sans">
        <TailwindWrapper>
          <Container className="bg-white mx-auto py-8 px-4 mb-16 rounded-lg shadow-sm">
            <Heading className="text-2xl font-bold text-gray-800 text-center mb-6">
              Employee Management System
            </Heading>
            
            <Section>
              <Text className="text-gray-700 text-base mb-4">
                Hello {fullName},
              </Text>
              <Text className="text-gray-700 text-base mb-4">
                You have requested to reset your password. Please use the following code:
              </Text>
              
              <Section className="bg-gray-100 p-4 rounded-md text-center my-6">
                <Text className="text-2xl font-bold tracking-widest text-brand">
                  {resetCode}
                </Text>
              </Section>

              <Text className="text-gray-700 text-base mb-4">
                If you didn't request a password reset, please ignore this email.
              </Text>
            </Section>

            <Section className="mt-8 border-t border-gray-200 pt-4">
              <Text className="text-gray-500 text-sm text-center">
                Employee Management System
              </Text>
            </Section>
          </Container>
        </TailwindWrapper>
      </Body>
    </Html>
  );
};
