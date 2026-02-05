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

interface VerificationEmailProps {
  verificationCode: string;
  fullName: string;
}

export const VerificationEmail = ({
  verificationCode,
  fullName,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
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
                Please use the following code to verify your email address:
              </Text>
              
              <Section className="bg-gray-100 p-4 rounded-md text-center my-6">
                <Text className="text-2xl font-bold tracking-widest text-brand">
                  {verificationCode}
                </Text>
              </Section>

              <Text className="text-gray-700 text-base mb-4">
                If you didn't request this verification, please ignore this email.
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
