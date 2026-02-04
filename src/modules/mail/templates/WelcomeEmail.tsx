import {
  Body,
  Button,
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

interface WelcomeEmailProps {
  fullName: string;
  email: string;
  password: string;
}

export const WelcomeEmail = ({
  fullName,
  email,
  password,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to GradVers - Your Academic Journey Starts Here!
      </Preview>
      <Body className="bg-[#f6f9fc] font-sans">
        <TailwindWrapper>
          <Container className="bg-white mx-auto py-5 pb-12 mb-16">
            <div className="flex mx-auto items-center mb-8">
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
              Welcome to GradVers!
            </Heading>

            <Text className="text-[#333] text-base my-6">Dear {fullName},</Text>

            <Text className="text-[#333] text-base my-6">
              Welcome to GradVers! We're excited to have you join our community
              of ambitious students and professionals. Your academic journey to
              success starts here.
            </Text>

            <Section className="bg-[#f4f4f4] rounded p-6 my-6">
              <Heading className="text-primary text-xl font-bold mb-4">
                Your Account Details
              </Heading>
              <Text className="text-[#333] text-base mb-2">Email: {email}</Text>
              <Text className="text-[#333] text-base mb-4">
                Password: {password}
              </Text>
              <Text className="text-[#333] text-sm italic">
                Please change your password after your first login for security
                purposes.
              </Text>
            </Section>

            <Section className="my-8">
              <Heading className="text-primary text-xl font-bold mb-4">
                What You Can Do on GradVers
              </Heading>

              <div className="space-y-4">
                <div>
                  <Text className="text-[#333] font-semibold">
                    🎓 University Research
                  </Text>
                  <Text className="text-[#333] text-sm">
                    Explore detailed profiles of universities, their programs,
                    and admission requirements.
                  </Text>
                </div>

                <div>
                  <Text className="text-[#333] font-semibold">
                    💰 Scholarship Opportunities
                  </Text>
                  <Text className="text-[#333] text-sm">
                    Discover and apply for scholarships that match your profile
                    and aspirations.
                  </Text>
                </div>

                <div>
                  <Text className="text-[#333] font-semibold">
                    👥 Community Engagement
                  </Text>
                  <Text className="text-[#333] text-sm">
                    Connect with peers, share experiences, and get advice from
                    the community.
                  </Text>
                </div>

                <div>
                  <Text className="text-[#333] font-semibold">
                    📊 Admission Insights
                  </Text>
                  <Text className="text-[#333] text-sm">
                    Access real admission profiles and statistics to make
                    informed decisions.
                  </Text>
                </div>
              </div>
            </Section>

            <Section className="text-center my-8">
              <Button
                href="https://gradvers.com/auth/login"
                className="bg-primary text-white px-6 py-3 rounded font-medium"
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-[#333] text-base my-6">
              If you have any questions or need assistance, our support team is
              here to help.
            </Text>

            <Text className="text-[#898989] text-sm mt-8">
              Best regards,
              <br />
              The GradVers Team
            </Text>
          </Container>
        </TailwindWrapper>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
