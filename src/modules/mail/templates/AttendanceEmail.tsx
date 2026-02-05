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

interface AttendanceEmailProps {
  fullName: string;
  type: 'Clock In' | 'Clock Out';
  time: string;
}

export const AttendanceEmail = ({
  fullName,
  type,
  time,
}: AttendanceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Attendance Notification: {type}</Preview>
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
                This is a notification that you have successfully <strong>{type === 'Clock In' ? 'clocked in' : 'clocked out'}</strong>.
              </Text>
              
              <Section className="bg-gray-100 p-4 rounded-md my-6">
                <Text className="text-gray-700 text-base font-semibold">
                  Type: <span className={type === 'Clock In' ? 'text-green-600' : 'text-blue-600'}>{type}</span>
                </Text>
                <Text className="text-gray-700 text-base font-semibold mt-2">
                  Time: {time}
                </Text>
              </Section>
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
